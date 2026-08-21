import { prisma } from '../config/database.js';
import type { Role } from '@prisma/client';

export const toSafeUser = (user: any) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role as Role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

export const listUsers = async (opts: { page?: number; limit?: number; search?: string } = {}) => {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.max(1, Math.min(100, opts.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: any = {};
  if (opts.search) {
    where.OR = [
      { name: { contains: opts.search, mode: 'insensitive' } },
      { email: { contains: opts.search, mode: 'insensitive' } }
    ];
  }

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } })
  ]);

  return {
    data: users.map(toSafeUser),
    meta: { total, page, limit, pages: Math.ceil(total / limit) }
  };
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    const error = new Error('User not found');
    error.name = 'NotFoundError';
    throw error;
  }
  return toSafeUser(user);
};

export const updateUser = async (id: string, data: { name?: string; role?: Role }) => {
  const user = await prisma.user.update({ where: { id }, data });
  return toSafeUser(user);
};

export const deleteUser = async (id: string) => {
  await prisma.user.delete({ where: { id } });
  return true;
};
