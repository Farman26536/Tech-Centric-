import type { Request, Response, NextFunction } from 'express';
import { getCommentsForTask, createComment, updateComment, deleteComment } from '../services/comment.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const listComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comments = await getCommentsForTask(req.params.taskId);
    successResponse(res, { comments });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.auth) throw new Error('Authentication required');
    const comment = await createComment(req.params.taskId, req.auth.userId, req.body.content);
    successResponse(res, { comment }, 201);
  } catch (error) {
    next(error);
  }
};

export const putComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.auth) throw new Error('Authentication required');
    const isAdmin = req.auth.role === 'ADMIN';
    const comment = await updateComment(req.params.id, req.auth.userId, req.body.content, isAdmin);
    successResponse(res, { comment });
  } catch (error) {
    next(error);
  }
};

export const removeComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.auth) throw new Error('Authentication required');
    const isAdmin = req.auth.role === 'ADMIN';
    await deleteComment(req.params.id, req.auth.userId, isAdmin);
    successResponse(res, { message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
};
