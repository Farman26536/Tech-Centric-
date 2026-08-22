import type { Request, Response, NextFunction } from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  archiveProject,
  deleteProject,
} from '../services/project.service.js';
import { createProjectSchema } from '../validators/project.validator.js';

import { successResponse } from '../utils/apiResponse.js';

export const listProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);

    const result = await getProjects({ page, limit });

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = createProjectSchema.parse(req.body);

    const project = await createProject({ ...data, actorId: req.auth?.userId });

    successResponse(res, { project }, 201);
  } catch (error) {
    next(error);
  }
};

export const getProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = String(req.params.id);

    const project = await getProjectById(id);

    successResponse(res, { project });
  } catch (error) {
    next(error);
  }
};

export const putProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = String(req.params.id);

    // updateProject accepts only 2 arguments: id and data
    const project = await updateProject(id, req.body);

    successResponse(res, { project });
  } catch (error) {
    next(error);
  }
};

export const patchArchive = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = String(req.params.id);

    const project = await archiveProject(id);

    successResponse(res, { project });
  } catch (error) {
    next(error);
  }
};

export const removeProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = String(req.params.id);

    await deleteProject(id);

    successResponse(res, { message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
};
