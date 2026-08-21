import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { errorResponse } from '../utils/apiResponse.js';
import { HttpError } from '../utils/httpError.js';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    const message = error.issues.map((issue) => issue.message).join(', ');
    errorResponse(res, message, 400);
    return;
  }

  if (error instanceof HttpError) {
    errorResponse(res, error.message, error.statusCode);
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    errorResponse(res, 'A record with the provided unique value already exists', 409);
    return;
  }

  if (error?.name === 'ConflictError') {
    errorResponse(res, error.message, 409);
    return;
  }

  if (error?.name === 'AuthenticationError') {
    errorResponse(res, error.message, 401);
    return;
  }

  if (error?.name === 'NotFoundError') {
    errorResponse(res, error.message, 404);
    return;
  }

  console.error(error);
  errorResponse(res, 'Internal server error', 500);
};
