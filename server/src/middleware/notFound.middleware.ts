import type { Request, Response } from 'express';
import { errorResponse } from '../utils/apiResponse.js';

export const notFoundHandler = (req: Request, res: Response): void => {
  errorResponse(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
};
