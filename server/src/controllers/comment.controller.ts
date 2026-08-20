import type { Request, Response } from 'express';
import { createCommentSchema, updateCommentSchema } from '../validators/comment.validator';
import * as commentService from '../services/comment.service';
import { HttpError } from '../utils/httpError';

function user(req: Request) {
  if (!req.user) throw new HttpError(401, 'Authentication required');
  return req.user;
}

export async function list(req: Request, res: Response) {
  const u = user(req);
  res.json({ success: true, data: await commentService.listComments(req.params.taskId, u.userId, u.role) });
}

export async function create(req: Request, res: Response) {
  const u = user(req);
  const { content } = createCommentSchema.parse(req.body);
  res.status(201).json({ success: true, data: await commentService.createComment(req.params.taskId, u.userId, u.role, content) });
}

export async function update(req: Request, res: Response) {
  const u = user(req);
  const { content } = updateCommentSchema.parse(req.body);
  res.json({ success: true, data: await commentService.updateComment(req.params.id, u.userId, u.role, content) });
}

export async function remove(req: Request, res: Response) {
  const u = user(req);
  await commentService.deleteComment(req.params.id, u.userId, u.role);
  res.json({ success: true, data: null });
}
