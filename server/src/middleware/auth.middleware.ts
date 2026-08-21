import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/apiResponse.js';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.teamflow_token as string | undefined;

  if (!token) {
    errorResponse(res, 'Authentication required', 401);
    return;
  }

  try {
    req.auth = verifyAccessToken(token);
    next();
  } catch {
    errorResponse(res, 'Invalid or expired authentication token', 401);
  }
};
