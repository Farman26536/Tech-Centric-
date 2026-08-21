import { Router } from 'express';
import { listComments, create, putComment, removeComment } from '../controllers/comment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

export const commentRouter = Router();

commentRouter.get('/tasks/:taskId/comments', authenticate, listComments);
commentRouter.post('/tasks/:taskId/comments', authenticate, create);
commentRouter.put('/comments/:id', authenticate, putComment);
commentRouter.delete('/comments/:id', authenticate, removeComment);
