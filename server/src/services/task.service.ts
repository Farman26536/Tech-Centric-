import { prisma } from '../config/database.js';
import { logActivity } from './activity.service.js';
import type { TaskStatus, TaskPriority } from '@prisma/client';

export const createTask = async (data: {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: Date | null;
  projectId: string;
  assignedToId?: string | null;
  actorId?: string;
}) => {
  const { actorId, ...taskData } = data;
  const task = await prisma.task.create({ data: taskData as any });
  await logActivity({ actorId: data.actorId, action: 'TASK_CREATED', entity: 'TASK', entityId: task.id, taskId: task.id, projectId: task.projectId, message: `Created task "${task.title}"` });
  return task;
};

export const getTasks = async (opts: {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedTo?: string;
  projectId?: string;
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
  overdue?: boolean;
}) => {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.max(1, Math.min(100, opts.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: any = {};
  if (opts.search) {
    where.OR = [{ title: { contains: opts.search, mode: 'insensitive' } }, { description: { contains: opts.search, mode: 'insensitive' } }];
  }
  if (opts.status) where.status = opts.status;
  if (opts.priority) where.priority = opts.priority;
  if (opts.assignedTo) where.assignedToId = opts.assignedTo;
  if (opts.projectId) where.projectId = opts.projectId;
  if (opts.overdue) where.dueDate = { lt: new Date() };
  const sortBy = opts.sortBy ?? 'createdAt';
  const sortOrder = opts.sortOrder ?? 'desc';

  const [total, tasks] = await Promise.all([
    prisma.task.count({ where }),
    prisma.task.findMany({ where, skip, take: limit, orderBy: { [sortBy]: sortOrder } as any })
  ]);

  return { data: tasks, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
};

export const getTaskById = async (id: string) => {
  const task = await prisma.task.findUnique({ where: { id }, include: { comments: true } });
  if (!task) {
    const error = new Error('Task not found');
    error.name = 'NotFoundError';
    throw error;
  }
  return task;
};

export const updateTask = async (id: string, data: Partial<any>, actorId?: string) => {
  const task = await prisma.task.update({ where: { id }, data });
  await logActivity({ actorId, action: 'TASK_UPDATED', entity: 'TASK', entityId: task.id, taskId: task.id, projectId: task.projectId, message: `Updated task "${task.title}"` });
  return task;
};

export const updateTaskStatus = async (id: string, status: TaskStatus, actorId?: string) => {
  const data: any = { status };
  if (status === 'COMPLETED') data.completedAt = new Date();

  const task = await prisma.task.update({ where: { id }, data });
  await logActivity({ actorId, action: 'TASK_STATUS_CHANGED', entity: 'TASK', entityId: task.id, taskId: task.id, projectId: task.projectId, message: `Changed task status to ${status}` });
  return task;
};

export const deleteTask = async (id: string) => {
  await prisma.task.delete({ where: { id } });
  return true;
};
