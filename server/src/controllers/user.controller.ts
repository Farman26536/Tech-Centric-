import type { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service.js';
import { errorResponse, successResponse } from '../utils/apiResponse.js';

function user(req: Request) {
  if (!req.auth) throw new Error('Authentication required');
  return req.auth;
}

export async function listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const u = user(req);
    const { page = 1, limit = 20, search = '', role = '' } = req.query as { page?: string; limit?: string; search?: string; role?: string };
    const result = await userService.listUsers(u.userId, u.role, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      search: search || '',
      role: (role as any) || ''
    });
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const u = user(req);
    const userData = await userService.getUser(req.params.id, u.role);
    successResponse(res, userData);
  } catch (error) {
    next(error);
  }
}

export async function getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const u = user(req);
    const userData = await userService.getCurrentUser(u.userId);
    successResponse(res, userData);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const u = user(req);
    const { name, email } = req.body as { name?: string; email?: string };
    const updated = await userService.updateUser(req.params.id, u.userId, u.role, { name, email });
    successResponse(res, updated);
  } catch (error) {
    next(error);
  }
}

export async function updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const u = user(req);
    const { role } = req.body as { role: 'ADMIN' | 'MEMBER' };
    const updated = await userService.updateUserRole(req.params.id, u.role, role);
    successResponse(res, updated);
  } catch (error) {
    next(error);
  }
}
