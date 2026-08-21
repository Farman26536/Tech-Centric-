import type { Request, Response } from 'express';
import { createTaskSchema, taskQuerySchema, updateStatusSchema, updateTaskSchema } from '../validators/task.validator';
import * as taskService from '../services/task.service';
import { HttpError } from '../utils/httpError';

function user(req: Request) {
  if (!req.user) throw new HttpError(401, 'Authentication required');
  return req.user;
}

export async function list(req: Request, res: Response) {
  const u = user(req);
  const query = taskQuerySchema.parse(req.query);
  res.json({ success: true, ...(await taskService.listTasks(u.userId, u.role, query)) });
}

export async function get(req: Request, res: Response) {
  const u = user(req);
  res.json({ success: true, data: await taskService.getTask(req.params.id, u.userId, u.role) });
}

export async function create(req: Request, res: Response) {
  const u = user(req);
  if (u.role !== 'ADMIN') throw new HttpError(403, 'Admin access required');
  const input = createTaskSchema.parse(req.body);
  res.status(201).json({ success: true, data: await taskService.createTask(input) });
}

export async function update(req: Request, res: Response) {
  const u = user(req);
  if (u.role !== 'ADMIN') throw new HttpError(403, 'Members may only change task status');
  const input = updateTaskSchema.parse(req.body);
  res.json({ success: true, data: await taskService.updateTask(req.params.id, input) });
}

export async function status(req: Request, res: Response) {
  const u = user(req);
  const input = updateStatusSchema.parse(req.body);
  res.json({ success: true, data: await taskService.updateTaskStatus(req.params.id, u.userId, u.role, input.status) });
}

export async function remove(req: Request, res: Response) {
  const u = user(req);
  if (u.role !== 'ADMIN') throw new HttpError(403, 'Admin access required');
  await taskService.deleteTask(req.params.id);
  res.json({ success: true, data: null });
}
