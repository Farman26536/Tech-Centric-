import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { errorResponse } from '../utils/apiResponse.js';

export const requireTaskAssignmentOrAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.auth) {
    errorResponse(res, 'Authentication required', 401);
    return;
  }

  const taskId = String(req.params.id);
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) {
    errorResponse(res, 'Task not found', 404);
    return;
  }

  if (req.auth.role === 'ADMIN') {
    next();
    return;
  }

  if (task.assignedToId !== req.auth.userId) {
    errorResponse(res, 'You are not allowed to update this task', 403);
    return;
  }

  next();
};
