import type { Role } from '@prisma/client';
import { prisma } from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { createAccessToken } from '../utils/jwt.js';
import type { LoginInput, RegisterInput } from '../validators/auth.validator.js';

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

const toSafeUser = (user: {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}): SafeUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

export const registerUser = async (input: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({ where: { email: input.email } });

  if (existingUser) {
    const error = new Error('An account with this email already exists');
    error.name = 'ConflictError';
    throw error;
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role
    }
  });

  return {
    user: toSafeUser(user),
    token: createAccessToken({ userId: user.id, role: user.role })
  };
};

export const loginUser = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  const validPassword = user ? await comparePassword(input.password, user.passwordHash) : false;

  if (!user || !validPassword) {
    const error = new Error('Invalid email or password');
    error.name = 'AuthenticationError';
    throw error;
  }

  return {
    user: toSafeUser(user),
    token: createAccessToken({ userId: user.id, role: user.role })
  };
};

export const getCurrentUser = async (userId: string): Promise<SafeUser> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) {
    const error = new Error('User not found');
    error.name = 'NotFoundError';
    throw error;
  }

  return user;
};
