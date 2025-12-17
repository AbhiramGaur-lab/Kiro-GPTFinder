import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { randomBytes, createHash } from 'crypto';
import { prisma } from './db';
import { env } from './env';
import { UserRole, UserStatus } from '@prisma/client';

const SESSION_COOKIE = 'session-token';
const CSRF_COOKIE = 'csrf-token';

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

function signToken(token: string) {
  return createHash('sha256').update(token + env.COOKIE_SECRET).digest('hex');
}

export async function createSession(userId: string, req: NextRequest) {
  const token = randomBytes(32).toString('hex');
  const tokenHash = signToken(token);
  const userAgent = req.headers.get('user-agent') ?? undefined;
  const ip = req.headers.get('x-forwarded-for') ?? undefined;
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  await prisma.userSession.create({
    data: {
      userId,
      session_token_hash: tokenHash,
      expires_at: expiresAt,
      user_agent: userAgent,
      ip
    }
  });
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: true, path: '/', expires: expiresAt });
  const csrfToken = randomBytes(16).toString('hex');
  cookieStore.set(CSRF_COOKIE, csrfToken, { httpOnly: false, sameSite: 'lax', secure: true, path: '/' });
  return { token, csrfToken };
}

export async function getSessionUser(req: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const hash = signToken(token);
  const session = await prisma.userSession.findUnique({ where: { session_token_hash: hash }, include: { user: true } });
  if (!session || session.revoked_at || session.expires_at < new Date()) return null;
  return session.user;
}

export async function revokeOtherSessions(userId: string, keepHash?: string) {
  const sessions = await prisma.userSession.findMany({ where: { userId } });
  await Promise.all(
    sessions
      .filter((s) => s.session_token_hash !== keepHash)
      .map((s) => prisma.userSession.update({ where: { id: s.id }, data: { revoked_at: new Date() } }))
  );
}

export function requireCsrf(req: NextRequest) {
  const csrfHeader = req.headers.get('x-csrf-token');
  const csrfCookie = cookies().get(CSRF_COOKIE)?.value;
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    throw new Error('Invalid CSRF token');
  }
}

export function ensureRole(userRole: UserRole, allowed: UserRole[]) {
  if (!allowed.includes(userRole)) {
    throw new Error('Forbidden');
  }
}

export function ensureActive(status: UserStatus) {
  if (status !== UserStatus.ACTIVE) {
    throw new Error('User inactive');
  }
}
