import type { Request, Response, NextFunction } from 'express';
import { successResponse } from '../utils/apiResponse.js';
import { globalSearch, analytics, listNotifications, markNotificationRead, createDueNotifications, addAttachment, listAttachments, getAttachment, deleteAttachment } from '../services/feature.service.js';
import { listActivities } from '../services/activity.service.js';

export async function search(req: Request, res: Response, next: NextFunction) {
  try { successResponse(res, await globalSearch(String(req.query.q ?? ''), Number(req.query.limit ?? 8))); } catch (e) { next(e); }
}
export async function getAnalytics(_req: Request, res: Response, next: NextFunction) {
  try { successResponse(res, await analytics()); } catch (e) { next(e); }
}
export async function activities(req: Request, res: Response, next: NextFunction) {
  try {
    successResponse(res, await listActivities({
      page: Number(req.query.page ?? 1), limit: Number(req.query.limit ?? 25),
      taskId: typeof req.query.taskId === 'string' ? req.query.taskId : undefined,
      projectId: typeof req.query.projectId === 'string' ? req.query.projectId : undefined
    }));
  } catch (e) { next(e); }
}
export async function notifications(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) throw Object.assign(new Error('Authentication required'), { name: 'AuthorizationError' });
    await createDueNotifications(req.auth.userId);
    successResponse(res, { notifications: await listNotifications(req.auth.userId, req.query.unread === 'true') });
  } catch (e) { next(e); }
}
export async function readNotification(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) throw Object.assign(new Error('Authentication required'), { name: 'AuthorizationError' });
    await markNotificationRead(req.auth.userId, String(req.params.id));
    successResponse(res, { ok: true });
  } catch (e) { next(e); }
}
export async function uploadAttachment(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) throw Object.assign(new Error('Authentication required'), { name: 'AuthorizationError' });
    const file = req.body;
    if (!file?.fileName || !file?.data) throw Object.assign(new Error('fileName and data are required'), { name: 'ValidationError' });
    const attachment = await addAttachment({ taskId: String(req.params.taskId), uploadedById: req.auth.userId, fileName: file.fileName, mimeType: file.mimeType || 'application/octet-stream', size: Number(file.size || 0), data: file.data });
    successResponse(res, { attachment }, 201);
  } catch (e) { next(e); }
}
export async function attachments(req: Request, res: Response, next: NextFunction) {
  try { successResponse(res, { attachments: await listAttachments(String(req.params.taskId)) }); } catch (e) { next(e); }
}
export async function downloadAttachment(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await getAttachment(String(req.params.id));
    if (!item) return res.status(404).json({ success: false, message: 'Attachment not found' });
    const buffer = Buffer.from(item.data, 'base64');
    res.setHeader('Content-Type', item.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(item.fileName)}"`);
    return res.send(buffer);
  } catch (e) { next(e); }
}
export async function removeAttachment(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.auth) throw Object.assign(new Error('Authentication required'), { name: 'AuthorizationError' });
    await deleteAttachment(String(req.params.id), req.auth.userId, req.auth.role === 'ADMIN');
    successResponse(res, { ok: true });
  } catch (e) { next(e); }
}
