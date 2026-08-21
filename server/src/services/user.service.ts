import { prisma } from '../utils/prisma.js';
import { HttpError } from '../utils/httpError.js';

export async function listUsers(
  userId: string,
  role: string,
  filters: { page: number; limit: number; search?: string; role?: string }
) {
  try {
    const where: any = {};
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } }
      ];
    }
    if (filters.role && role === 'ADMIN') {
      where.role = filters.role;
    }

    const skip = (filters.page - 1) * filters.limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: filters.limit
      }),
      prisma.user.count({ where })
    ]);

    return {
      data: users,
      pagination: { page: filters.page, limit: filters.limit, total, totalPages: Math.ceil(total / filters.limit) }
    };
  } catch (error) {
    throw new HttpError(500, 'Failed to list users');
  }
}

export async function getUser(userId: string, requesterRole: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true }
  });

  if (!user) throw new HttpError(404, 'User not found');
  return user;
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true }
  });

  if (!user) throw new HttpError(404, 'User not found');
  return user;
}

export async function updateUser(
  userId: string,
  requesterUserId: string,
  requesterRole: string,
  input: { name?: string; email?: string }
) {
  if (requesterRole !== 'ADMIN' && userId !== requesterUserId) {
    throw new HttpError(403, 'You can only update your own profile');
  }

  const existing = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!existing) throw new HttpError(404, 'User not found');

  const data: any = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.email !== undefined) data.email = input.email;

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true }
  });

  return updated;
}

export async function updateUserRole(userId: string, requesterRole: string, newRole: string) {
  if (requesterRole !== 'ADMIN') {
    throw new HttpError(403, 'Only admins can change user roles');
  }

  const existing = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!existing) throw new HttpError(404, 'User not found');

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
    select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true }
  });

  return updated;
}
