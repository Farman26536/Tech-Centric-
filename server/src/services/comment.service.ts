import { prisma } from '../config/database.js';
import { logActivity } from './activity.service.js';

export const getCommentsForTask = async (taskId: string) => {
  return prisma.comment.findMany({ where: { taskId }, orderBy: { createdAt: 'asc' } });
};

export const createComment = async (taskId: string, authorId: string, content: string) => {
  const comment = await prisma.comment.create({ data: { taskId, authorId, content } });
  await logActivity({ actorId: authorId, action: 'COMMENT_ADDED', entity: 'COMMENT', entityId: comment.id, taskId, message: 'Added a task comment' });
  return comment;
};

export const updateComment = async (id: string, authorId: string, content: string, isAdmin = false) => {
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) {
    const error = new Error('Comment not found');
    error.name = 'NotFoundError';
    throw error;
  }
  if (comment.authorId !== authorId && !isAdmin) {
    const error = new Error('Not authorized to edit this comment');
    error.name = 'AuthorizationError';
    throw error;
  }
  return prisma.comment.update({ where: { id }, data: { content } });
};

export const deleteComment = async (id: string, authorId: string, isAdmin = false) => {
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) {
    const error = new Error('Comment not found');
    error.name = 'NotFoundError';
    throw error;
  }
  if (comment.authorId !== authorId && !isAdmin) {
    const error = new Error('Not authorized to delete this comment');
    error.name = 'AuthorizationError';
    throw error;
  }
  await prisma.comment.delete({ where: { id } });
  return true;
};
