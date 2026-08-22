import { Router } from 'express';
import { getUsers, getUser, putUser, removeUser } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/role.middleware.js';

export const userRouter = Router();

userRouter.use(authenticate);

userRouter.get('/', getUsers);
userRouter.get('/:id', getUser);
userRouter.put('/:id', requireAdmin, putUser);
userRouter.delete('/:id', requireAdmin, removeUser);
