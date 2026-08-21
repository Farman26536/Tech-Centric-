import { Prisma, Role } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { HttpError } from '../utils/httpError';
import { canAccessTask } from './task.service';

const commentInclude = { author: { select: { id: true, name: true, email: true, role: true } } } satisfies Prisma.CommentInclude;

export async function listComments(taskId: string, userId: string, role: Role) {
  await canAccessTask(taskId, userId, role);
  return prisma.comment.findMany({ where: { taskId }, include: commentInclude, orderBy: { createdAt: 'asc' } });
}

export async function createComment(taskId: string, authorId: string, role: Role, content: string) {
  await canAccessTask(taskId, authorId, role);
  return prisma.comment.create({ data: { content, taskId, authorId }, include: commentInclude });
}

export async function updateComment(id: string, userId: string, role: Role, content: string) {
  const existing = await prisma.comment.findUnique({ where: { id }, select: { id: true, authorId: true } });
  if (!existing) throw new HttpError(404, 'Comment not found');
  if (role !== Role.ADMIN && existing.authorId !== userId) throw new HttpError(403, 'You can only edit your own comments');
  return prisma.comment.update({ where: { id }, data: { content }, include: commentInclude });
}

export async function deleteComment(id: string, userId: string, role: Role) {
  const existing = await prisma.comment.findUnique({ where: { id }, select: { id: true, authorId: true } });
  if (!existing) throw new HttpError(404, 'Comment not found');
  if (role !== Role.ADMIN && existing.authorId !== userId) throw new HttpError(403, 'You can only delete your own comments');
  await prisma.comment.delete({ where: { id } });
}
