import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';
import * as projectController from '../controllers/project.controller.js';

export const projectRouter = Router();

projectRouter.get('/', authenticate, projectController.listProjects);
projectRouter.post('/', authenticate, requireAdmin, projectController.createProject);
projectRouter.get('/:id', authenticate, projectController.getProject);
projectRouter.put('/:id', authenticate, requireAdmin, projectController.updateProject);
projectRouter.delete('/:id', authenticate, requireAdmin, projectController.deleteProject);
