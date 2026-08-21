import type { Request, Response, NextFunction } from 'express';
import { overview, projectsOverview, tasksOverview, teamPerformance } from '../services/dashboard.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const getOverview = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await overview();
    successResponse(res, { data });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await projectsOverview();
    successResponse(res, { data });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await tasksOverview();
    successResponse(res, { data });
  } catch (error) {
    next(error);
  }
};

export const getTeamPerformance = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await teamPerformance();
    successResponse(res, { data });
  } catch (error) {
    next(error);
  }
};
