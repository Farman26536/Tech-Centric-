import jwt, { type SignOptions } from 'jsonwebtoken';
import type { Role } from '@prisma/client';
import { env } from '../config/env.js';

export interface AuthTokenPayload {
  userId: string;
  role: Role;
}

export const createAccessToken = (payload: AuthTokenPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn']
  });
};

export const verifyAccessToken = (token: string): AuthTokenPayload => {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (typeof decoded !== 'object' || decoded === null) {
    throw new Error('Invalid authentication token');
  }

  const userId = decoded.userId;
  const role = decoded.role;

  if (typeof userId !== 'string' || (role !== 'ADMIN' && role !== 'MEMBER')) {
    throw new Error('Invalid authentication token');
  }

  return { userId, role };
};
