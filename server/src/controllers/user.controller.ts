import type { Request, Response, NextFunction } from 'express';
import { listUsers, getUserById, updateUser, deleteUser } from '../services/user.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const result = await listUsers({ page, limit, search });
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const user = await getUserById(id);
    successResponse(res, { user });
  } catch (error) {
    next(error);
  }
};

export const putUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const id = String(req.params.id);
    const user = await updateUser(id, data);
    successResponse(res, { user });
  } catch (error) {
    next(error);
  }
};

export const removeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    await deleteUser(id);
    successResponse(res, { message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};
