import { prisma } from '../config/database.js';
import { logActivity } from './activity.service.js';
import { sendEmail } from './email.service.js';

export async function globalSearch(q: string, limit = 8) {
  const query = q.trim();
  if (!query) return { projects: [], tasks: [] };
  const [projects, tasks] = await Promise.all([
    prisma.project.findMany({
      where: { OR: [{ name: { contains: query, mode: 'insensitive' } }, { description: { contains: query, mode: 'insensitive' } }] },
      take: limit, orderBy: { updatedAt: 'desc' }
    }),
    prisma.task.findMany({
      where: { OR: [{ title: { contains: query, mode: 'insensitive' } }, { description: { contains: query, mode: 'insensitive' } }] },
      take: limit, orderBy: { updatedAt: 'desc' },
      include: { project: { select: { id: true, name: true } } }
    })
  ]);
  return { projects, tasks };
}

export async function analytics() {
  const now = new Date();
  const [projects, tasks, users, activity] = await Promise.all([
    prisma.project.findMany({ include: { tasks: true } }),
    prisma.task.findMany({ include: { assignedTo: true } }),
    prisma.user.findMany({ select: { id: true, name: true } }),
    prisma.activityLog.findMany({ take: 50, orderBy: { createdAt: 'desc' } })
  ]);
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'COMPLETED').length;
  const overdue = tasks.filter(t => t.status !== 'COMPLETED' && t.dueDate && t.dueDate < now).length;
  const byPriority = ['LOW', 'MEDIUM', 'HIGH'].map(priority => ({ priority, count: tasks.filter(t => t.priority === priority).length }));
  const byStatus = ['TODO', 'IN_PROGRESS', 'COMPLETED'].map(status => ({ status, count: tasks.filter(t => t.status === status).length }));
  const performance = users.map(user => {
    const assigned = tasks.filter(t => t.assignedToId === user.id);
    const done = assigned.filter(t => t.status === 'COMPLETED').length;
    return { userId: user.id, name: user.name, assigned: assigned.length, completed: done, completionRate: assigned.length ? Math.round(done / assigned.length * 100) : 0 };
  });
  return {
    summary: { projects: projects.length, tasks: total, completed, overdue, completionRate: total ? Math.round(completed / total * 100) : 0 },
    byPriority, byStatus, performance,
    projectProgress: projects.map(p => {
      const done = p.tasks.filter(t => t.status === 'COMPLETED').length;
      return { id: p.id, name: p.name, total: p.tasks.length, completed: done, progress: p.tasks.length ? Math.round(done / p.tasks.length * 100) : 0 };
    }),
    recentActivityCount: activity.length
  };
}

export async function listNotifications(userId: string, unreadOnly = false) {
  const where: any = { userId };
  if (unreadOnly) where.read = false;
  return prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' }, take: 50 });
}

export async function markNotificationRead(userId: string, id: string) {
  return prisma.notification.updateMany({ where: { id, userId }, data: { read: true, readAt: new Date() } });
}

export async function createDueNotifications(userId: string) {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const tasks = await prisma.task.findMany({
    where: { assignedToId: userId, status: { not: 'COMPLETED' }, dueDate: { not: null, lte: tomorrow } },
    take: 20
  });
  for (const task of tasks) {
    const type = task.dueDate && task.dueDate < now ? 'TASK_OVERDUE' : 'TASK_DUE';
    const exists = await prisma.notification.findFirst({
      where: { userId, type, message: { contains: task.id } },
      orderBy: { createdAt: 'desc' }
    });
    if (!exists) {
      const notification = await prisma.notification.create({
        data: {
          userId, type,
          title: type === 'TASK_OVERDUE' ? 'Task overdue' : 'Task due soon',
          message: `${task.title} (${task.id}) is ${type === 'TASK_OVERDUE' ? 'overdue' : 'due within 24 hours'}.`
        }
      });
      const owner = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } });
      if (owner) {
        const email = await sendEmail({
          to: owner.email,
          subject: notification.title,
          html: `<p>Hello ${owner.name},</p><p>${notification.message}</p><p>Open TeamFlow to review the task.</p>`
        });
        if (email.sent) await prisma.notification.update({ where: { id: notification.id }, data: { emailSent: true } });
      }
    }
  }
}

export async function addAttachment(input: { taskId: string; uploadedById: string; fileName: string; mimeType: string; size: number; data: string }) {
  if (input.size > 5 * 1024 * 1024) {
    const error = new Error('Attachments are limited to 5 MB.');
    error.name = 'ValidationError';
    throw error;
  }
  const attachment = await prisma.attachment.create({ data: input });
  await logActivity({ actorId: input.uploadedById, action: 'ATTACHMENT_ADDED', entity: 'TASK', entityId: input.taskId, taskId: input.taskId, message: `Attached ${input.fileName}` });
  return attachment;
}

export async function listAttachments(taskId: string) {
  return prisma.attachment.findMany({ where: { taskId }, orderBy: { createdAt: 'desc' }, select: { id: true, fileName: true, mimeType: true, size: true, taskId: true, uploadedById: true, createdAt: true } });
}

export async function getAttachment(id: string) {
  return prisma.attachment.findUnique({ where: { id } });
}

export async function deleteAttachment(id: string, userId: string, isAdmin: boolean) {
  const item = await prisma.attachment.findUnique({ where: { id } });
  if (!item) throw Object.assign(new Error('Attachment not found'), { name: 'NotFoundError' });
  if (!isAdmin && item.uploadedById !== userId) throw Object.assign(new Error('Not authorized'), { name: 'AuthorizationError' });
  await prisma.attachment.delete({ where: { id } });
}
