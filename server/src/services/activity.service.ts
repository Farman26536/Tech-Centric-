import { prisma } from '../config/database.js';

export async function logActivity(input: {
  actorId?: string;
  action: string;
  entity: string;
  entityId?: string;
  message: string;
  projectId?: string;
  taskId?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    return await prisma.activityLog.create({
      data: {
        actorId: input.actorId,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId,
        message: input.message,
        projectId: input.projectId,
        taskId: input.taskId,
        metadata: input.metadata as any
      }
    });
  } catch {
    // Audit logging must never break the primary operation.
    return null;
  }
}

export async function listActivities(opts: { page?: number; limit?: number; taskId?: string; projectId?: string } = {}) {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.max(1, Math.min(100, opts.limit ?? 25));
  const where: any = {};
  if (opts.taskId) where.taskId = opts.taskId;
  if (opts.projectId) where.projectId = opts.projectId;
  const [total, data] = await Promise.all([
    prisma.activityLog.count({ where }),
    prisma.activityLog.findMany({
      where, skip: (page - 1) * limit, take: limit,
      orderBy: { createdAt: 'desc' },
      include: { actor: { select: { id: true, name: true, email: true } } }
    })
  ]);
  return { data, meta: { total, page, limit, pages: Math.ceil(total / limit) } };
}
