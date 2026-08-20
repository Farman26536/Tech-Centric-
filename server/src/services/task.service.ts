import { Prisma, Role, TaskStatus } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { HttpError } from '../utils/httpError';

const taskInclude = {
  assignedUser: { select: { id: true, name: true, email: true, role: true } },
  project: { select: { id: true, title: true, deadline: true, status: true } },
  _count: { select: { comments: true } },
} satisfies Prisma.TaskInclude;

function parseDueDate(value: string | null | undefined): Date | null {
  if (value === undefined || value === null || value === '') return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new HttpError(400, 'Invalid dueDate');
  return date;
}

function withOverdue<T extends { dueDate: Date | null; status: TaskStatus }>(task: T) {
  const now = new Date();
  return { ...task, overdue: Boolean(task.dueDate && task.dueDate < now && task.status !== TaskStatus.COMPLETED) };
}

async function ensureReferences(projectId: string, assignedTo: string) {
  const [project, user] = await Promise.all([
    prisma.project.findUnique({ where: { id: projectId }, select: { id: true } }),
    prisma.user.findUnique({ where: { id: assignedTo }, select: { id: true, role: true } }),
  ]);
  if (!project) throw new HttpError(400, 'Project not found');
  if (!user) throw new HttpError(400, 'Assigned user not found');
  if (user.role !== Role.MEMBER) throw new HttpError(400, 'Tasks can only be assigned to members');
}

export async function listTasks(userId: string, role: Role, filters: {
  search?: string; status?: TaskStatus; priority?: 'LOW' | 'MEDIUM' | 'HIGH'; assignedTo?: string; projectId?: string;
  page: number; limit: number;
}) {
  const where: Prisma.TaskWhereInput = {};
  if (role === Role.MEMBER) where.assignedTo = userId;
  else if (filters.assignedTo) where.assignedTo = filters.assignedTo;
  if (filters.projectId) where.projectId = filters.projectId;
  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const skip = (filters.page - 1) * filters.limit;
  const [tasks, total] = await Promise.all([
    prisma.task.findMany({ where, include: taskInclude, orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }], skip, take: filters.limit }),
    prisma.task.count({ where }),
  ]);

  return {
    data: tasks.map(withOverdue),
    pagination: { page: filters.page, limit: filters.limit, total, totalPages: Math.ceil(total / filters.limit) },
  };
}

export async function getTask(id: string, userId: string, role: Role) {
  const task = await prisma.task.findUnique({ where: { id }, include: { ...taskInclude, comments: { orderBy: { createdAt: 'asc' }, include: { author: { select: { id: true, name: true, email: true } } } } } });
  if (!task) throw new HttpError(404, 'Task not found');
  if (role === Role.MEMBER && task.assignedTo !== userId) throw new HttpError(403, 'You can only access tasks assigned to you');
  return withOverdue(task);
}

export async function createTask(input: {
  title: string; description?: string | null; projectId: string; assignedTo: string; priority: 'LOW' | 'MEDIUM' | 'HIGH'; status: TaskStatus; dueDate?: string | null;
}) {
  await ensureReferences(input.projectId, input.assignedTo);
  const dueDate = parseDueDate(input.dueDate);
  const completedAt = input.status === TaskStatus.COMPLETED ? new Date() : null;
  const task = await prisma.task.create({
    data: { title: input.title, description: input.description ?? null, projectId: input.projectId, assignedTo: input.assignedTo, priority: input.priority, status: input.status, dueDate, completedAt },
    include: taskInclude,
  });
  return withOverdue(task);
}

export async function updateTask(id: string, input: {
  title?: string; description?: string | null; projectId?: string; assignedTo?: string; priority?: 'LOW' | 'MEDIUM' | 'HIGH'; status?: TaskStatus; dueDate?: string | null;
}) {
  const existing = await prisma.task.findUnique({ where: { id }, select: { id: true, projectId: true, assignedTo: true, status: true, completedAt: true } });
  if (!existing) throw new HttpError(404, 'Task not found');
  const projectId = input.projectId ?? existing.projectId;
  const assignedTo = input.assignedTo ?? existing.assignedTo;
  if (input.projectId || input.assignedTo) await ensureReferences(projectId, assignedTo);
  const nextStatus = input.status ?? existing.status;
  const data: Prisma.TaskUpdateInput = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.description !== undefined) data.description = input.description;
  if (input.projectId !== undefined) data.project = { connect: { id: input.projectId } };
  if (input.assignedTo !== undefined) data.assignedUser = { connect: { id: input.assignedTo } };
  if (input.priority !== undefined) data.priority = input.priority;
  if (input.status !== undefined) data.status = input.status;
  if (input.dueDate !== undefined) data.dueDate = parseDueDate(input.dueDate);
  if (nextStatus === TaskStatus.COMPLETED && existing.status !== TaskStatus.COMPLETED) data.completedAt = new Date();
  if (nextStatus !== TaskStatus.COMPLETED && existing.status === TaskStatus.COMPLETED) data.completedAt = null;
  const task = await prisma.task.update({ where: { id }, data, include: taskInclude });
  return withOverdue(task);
}

export async function updateTaskStatus(id: string, userId: string, role: Role, status: TaskStatus) {
  const existing = await prisma.task.findUnique({ where: { id }, select: { id: true, assignedTo: true, status: true } });
  if (!existing) throw new HttpError(404, 'Task not found');
  if (role === Role.MEMBER && existing.assignedTo !== userId) throw new HttpError(403, 'You can only update the status of your assigned tasks');
  const task = await prisma.task.update({
    where: { id },
    data: {
      status,
      completedAt: status === TaskStatus.COMPLETED ? (existing.status === TaskStatus.COMPLETED ? undefined : new Date()) : null,
    },
    include: taskInclude,
  });
  return withOverdue(task);
}

export async function deleteTask(id: string) {
  const existing = await prisma.task.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw new HttpError(404, 'Task not found');
  await prisma.task.delete({ where: { id } });
}

export async function canAccessTask(taskId: string, userId: string, role: Role) {
  const task = await prisma.task.findUnique({ where: { id: taskId }, select: { id: true, assignedTo: true } });
  if (!task) throw new HttpError(404, 'Task not found');
  if (role === Role.MEMBER && task.assignedTo !== userId) throw new HttpError(403, 'You can only access tasks assigned to you');
  return task;
}
