import { Router } from 'express';
import { listTasks, create, getTask, putTask, patchStatus, removeTask } from '../controllers/task.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';
import { requireTaskAssignmentOrAdmin } from '../middleware/taskAuth.middleware.js';

export const taskRouter = Router();

taskRouter.get('/', authenticate, listTasks);
taskRouter.get('/:id', authenticate, getTask);

taskRouter.post('/', authenticate, requireAdmin, create);
taskRouter.put('/:id', authenticate, requireAdmin, putTask);
taskRouter.patch('/:id/status', authenticate, requireTaskAssignmentOrAdmin, patchStatus);
taskRouter.delete('/:id', authenticate, requireAdmin, removeTask);
