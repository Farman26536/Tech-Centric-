import { Router } from 'express';
import { getOverview, getProjects, getTasks, getTeamPerformance } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

export const dashboardRouter = Router();

dashboardRouter.get('/overview', authenticate, getOverview);
dashboardRouter.get('/projects', authenticate, getProjects);
dashboardRouter.get('/tasks', authenticate, getTasks);
dashboardRouter.get('/team-performance', authenticate, getTeamPerformance);
