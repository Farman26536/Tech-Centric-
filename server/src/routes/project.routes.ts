import { Router } from 'express';
import { listProjects, create, getProject, putProject, patchArchive, removeProject } from '../controllers/project.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';

export const projectRouter = Router();

projectRouter.get('/', authenticate, listProjects);
projectRouter.get('/:id', authenticate, getProject);

projectRouter.post('/', authenticate, requireAdmin, create);
projectRouter.put('/:id', authenticate, requireAdmin, putProject);
projectRouter.patch('/:id/archive', authenticate, requireAdmin, patchArchive);
projectRouter.delete('/:id', authenticate, requireAdmin, removeProject);
