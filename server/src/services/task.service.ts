import { prisma } from '../config/database.js';
import type { TaskStatus, TaskPriority } from '@prisma/client';

export const createTask = async (data: {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: Date | null;
  projectId: string;
  assignedToId?: string | null;
}) => {
  const task = await prisma.task.create({ data });
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

  const [total, tasks] = await Promise.all([
    prisma.task.count({ where }),
    prisma.task.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } })
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

export const updateTask = async (id: string, data: Partial<any>) => {
  const task = await prisma.task.update({ where: { id }, data });
  return task;
};

export const updateTaskStatus = async (id: string, status: TaskStatus) => {
  const data: any = { status };
  if (status === 'COMPLETED') data.completedAt = new Date();

  const task = await prisma.task.update({ where: { id }, data });
  return task;
};

export const deleteTask = async (id: string) => {
  await prisma.task.delete({ where: { id } });
  return true;
};
