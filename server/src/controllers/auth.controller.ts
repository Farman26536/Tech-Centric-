import type { Request, Response, NextFunction } from 'express';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';
import { getCurrentUser, loginUser, registerUser } from '../services/auth.service.js';
import { errorResponse, successResponse } from '../utils/apiResponse.js';
import { isProduction } from '../config/env.js';

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/'
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = registerSchema.parse(req.body);
    const result = await registerUser(input);
    res.cookie('teamflow_token', result.token, cookieOptions);
    successResponse(res, { user: result.user }, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const input = loginSchema.parse(req.body);
    const result = await loginUser(input);
    res.cookie('teamflow_token', result.token, cookieOptions);
    successResponse(res, { user: result.user });
  } catch (error) {
    next(error);
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('teamflow_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/'
  });
  successResponse(res, { message: 'Logged out successfully' });
};

export const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.auth) {
      errorResponse(res, 'Authentication required', 401);
      return;
    }

    const user = await getCurrentUser(req.auth.userId);
    successResponse(res, { user });
  } catch (error) {
    next(error);
  }
};
