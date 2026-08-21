import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';
import * as userController from '../controllers/user.controller.js';

export const userRouter = Router();

userRouter.get('/', authenticate, userController.listUsers);
userRouter.get('/me', authenticate, userController.getCurrentUser);
userRouter.get('/:id', authenticate, userController.getUser);
userRouter.put('/:id', authenticate, userController.updateUser);
userRouter.put('/:id/role', authenticate, requireAdmin, userController.updateUserRole);
