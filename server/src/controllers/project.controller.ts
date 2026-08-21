import type { Request, Response, NextFunction } from 'express';
import * as projectService from '../services/project.service.js';
import { errorResponse, successResponse } from '../utils/apiResponse.js';

function user(req: Request) {
  if (!req.auth) throw new Error('Authentication required');
  return req.auth;
}

export async function listProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const u = user(req);
    const { page = 1, limit = 20, search = '', status = '' } = req.query as { page?: string; limit?: string; search?: string; status?: string };
    const result = await projectService.listProjects(u.userId, u.role, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      search: search || '',
      status: (status as any) || ''
    });
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const u = user(req);
    const project = await projectService.getProject(req.params.id, u.userId, u.role);
    successResponse(res, project);
  } catch (error) {
    next(error);
  }
}

export async function createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const u = user(req);
    const { title, description, deadline, status } = req.body as { title: string; description?: string; deadline?: string; status?: string };
    const project = await projectService.createProject(u.userId, u.role, {
      title,
      description: description || null,
      deadline: deadline || null,
      status: (status as any) || 'ACTIVE'
    });
    successResponse(res, project, 201);
  } catch (error) {
    next(error);
  }
}

export async function updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const u = user(req);
    const { title, description, deadline, status } = req.body as { title?: string; description?: string; deadline?: string; status?: string };
    const project = await projectService.updateProject(req.params.id, u.userId, u.role, {
      title,
      description,
      deadline,
      status: (status as any) || ''
    });
    successResponse(res, project);
  } catch (error) {
    next(error);
  }
}

export async function deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const u = user(req);
    await projectService.deleteProject(req.params.id, u.userId, u.role);
    successResponse(res, { message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
}
