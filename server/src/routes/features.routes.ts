import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { search, getAnalytics, activities, notifications, readNotification, uploadAttachment, attachments, downloadAttachment, removeAttachment } from '../controllers/features.controller.js';

export const featureRouter = Router();
featureRouter.get('/search', authenticate, search);
featureRouter.get('/analytics', authenticate, getAnalytics);
featureRouter.get('/activities', authenticate, activities);
featureRouter.get('/notifications', authenticate, notifications);
featureRouter.patch('/notifications/:id/read', authenticate, readNotification);
featureRouter.get('/tasks/:taskId/attachments', authenticate, attachments);
featureRouter.post('/tasks/:taskId/attachments', authenticate, uploadAttachment);
featureRouter.get('/attachments/:id/download', authenticate, downloadAttachment);
featureRouter.delete('/attachments/:id', authenticate, removeAttachment);
