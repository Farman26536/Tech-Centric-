import type { Request, Response, NextFunction } from 'express';
import { createTask, getTasks, getTaskById, updateTask, updateTaskStatus, deleteTask } from '../services/task.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const listTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const filters = {
      page,
      limit,
      search,
      status: req.query.status as any,
      priority: req.query.priority as any,
      assignedTo: req.query.assignedTo as string | undefined,
      projectId: req.query.projectId as string | undefined
    };
    const result = await getTasks(filters);
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const task = await createTask(data);
    successResponse(res, { task }, 201);
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const task = await getTaskById(id);
    successResponse(res, { task });
  } catch (error) {
    next(error);
  }
};

export const putTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const task = await updateTask(id, req.body);
    successResponse(res, { task });
  } catch (error) {
    next(error);
  }
};

export const patchStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = req.body.status;
    const id = String(req.params.id);
    const task = await updateTaskStatus(id, status);
    successResponse(res, { task });
  } catch (error) {
    next(error);
  }
};

export const removeTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    await deleteTask(id);
    successResponse(res, { message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};
