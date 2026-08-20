import type { NextFunction, Request, Response } from 'express';
import { Role } from '@prisma/client';
import { HttpError } from '../utils/httpError';

export function requireAuthenticatedUser(req: Request, _res: Response, next: NextFunction) {
  if (!req.user?.userId || !req.user.role) {
    return next(new HttpError(401, 'Authentication required'));
  }
  next();
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== Role.ADMIN) {
    return next(new HttpError(403, 'Admin access required'));
  }
  next();
}
