import { prisma } from '../config/database.js';
import { logActivity } from './activity.service.js';
import type { ProjectStatus } from '@prisma/client';

export const createProject = async (data: {
  name: string;
  description?: string;
  startDate?: Date | null;
  dueDate?: Date | null;
  actorId?: string;
}) => {
  const project = await prisma.project.create({ data: { name: data.name, description: data.description, startDate: data.startDate, dueDate: data.dueDate } });
  await logActivity({ actorId: data.actorId, action: 'PROJECT_CREATED', entity: 'PROJECT', entityId: project.id, projectId: project.id, message: `Created project "${project.name}"` });
  return project;
};

export const getProjects = async (opts: { page?: number; limit?: number } = {}) => {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.max(1, Math.min(100, opts.limit ?? 20));
  const skip = (page - 1) * limit;

  const [total, projects] = await Promise.all([
    prisma.project.count(),
    prisma.project.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } })
  ]);

  return { data: projects, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
};

export const getProjectById = async (id: string) => {
  const project = await prisma.project.findUnique({ where: { id }, include: { tasks: true } });
  if (!project) {
    const error = new Error('Project not found');
    error.name = 'NotFoundError';
    throw error;
  }
  return project;
};

export const updateProject = async (id: string, data: Partial<{ name: string; description?: string; status?: ProjectStatus; startDate?: Date | null; dueDate?: Date | null }>) => {
  const project = await prisma.project.update({ where: { id }, data });
  return project;
};

export const archiveProject = async (id: string) => {
  const project = await prisma.project.update({ where: { id }, data: { status: 'ARCHIVED' } as any });
  return project;
};

export const deleteProject = async (id: string) => {
  await prisma.project.delete({ where: { id } });
  return true;
};
