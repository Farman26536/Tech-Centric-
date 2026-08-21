import { PrismaClient } from '@prisma/client';
import { HttpError } from '../utils/httpError.js';

const client = new PrismaClient();

export async function listProjects(
  userId: string,
  role: string,
  filters: { page: number; limit: number; search?: string; status?: string }
) {
  try {
    const where: any = {};
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ];
    }
    if (filters.status) {
      where.status = filters.status;
    }

    const skip = (filters.page - 1) * filters.limit;
    const [projects, total] = await Promise.all([
      client.project.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          deadline: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { tasks: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: filters.limit
      }),
      client.project.count({ where })
    ]);

    return {
      data: projects,
      pagination: { page: filters.page, limit: filters.limit, total, totalPages: Math.ceil(total / filters.limit) }
    };
  } catch (error) {
    throw new HttpError(500, 'Failed to list projects');
  }
}

export async function getProject(projectId: string, userId: string, role: string) {
  const project = await client.project.findUnique({
    where: { id: projectId },
    include: {
      tasks: {
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          assignedTo: true,
          dueDate: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      },
      _count: { select: { tasks: true } }
    }
  });

  if (!project) throw new HttpError(404, 'Project not found');
  return project;
}

export async function createProject(
  userId: string,
  role: string,
  input: { title: string; description?: string | null; deadline?: string | null; status?: string }
) {
  if (role !== 'ADMIN') {
    throw new HttpError(403, 'Only admins can create projects');
  }

  const project = await client.project.create({
    data: {
      title: input.title,
      description: input.description || null,
      deadline: input.deadline ? new Date(input.deadline) : null,
      status: input.status || 'ACTIVE'
    },
    select: {
      id: true,
      title: true,
      description: true,
      deadline: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { tasks: true } }
    }
  });

  return project;
}

export async function updateProject(
  projectId: string,
  userId: string,
  role: string,
  input: { title?: string; description?: string; deadline?: string; status?: string }
) {
  if (role !== 'ADMIN') {
    throw new HttpError(403, 'Only admins can update projects');
  }

  const existing = await client.project.findUnique({ where: { id: projectId }, select: { id: true } });
  if (!existing) throw new HttpError(404, 'Project not found');

  const data: any = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.description !== undefined) data.description = input.description;
  if (input.deadline !== undefined) data.deadline = input.deadline ? new Date(input.deadline) : null;
  if (input.status !== undefined) data.status = input.status;

  const project = await client.project.update({
    where: { id: projectId },
    data,
    select: {
      id: true,
      title: true,
      description: true,
      deadline: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { tasks: true } }
    }
  });

  return project;
}

export async function deleteProject(projectId: string, userId: string, role: string) {
  if (role !== 'ADMIN') {
    throw new HttpError(403, 'Only admins can delete projects');
  }

  const existing = await client.project.findUnique({
    where: { id: projectId },
    select: { id: true, tasks: { select: { id: true } } }
  });

  if (!existing) throw new HttpError(404, 'Project not found');

  if (existing.tasks.length > 0) {
    throw new HttpError(400, 'Cannot delete project with existing tasks');
  }

  await client.project.delete({ where: { id: projectId } });
}
