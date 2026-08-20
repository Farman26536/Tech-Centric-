import type { NextFunction, Request, Response } from 'express';
import type { Role } from '@prisma/client';
import { errorResponse } from '../utils/apiResponse.js';

export const requireRole = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      errorResponse(res, 'Authentication required', 401);
      return;
    }

    if (!allowedRoles.includes(req.auth.role)) {
      errorResponse(res, 'You do not have permission to perform this action', 403);
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole('ADMIN');
