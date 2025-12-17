import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { accessLog } from '../../../../lib/logging';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';
import { env } from '../../../../lib/env';

const SESSION_COOKIE = 'session-token';

export async function POST(req: NextRequest) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    const hash = createHash('sha256').update(token + env.COOKIE_SECRET).digest('hex');
    const session = await prisma.userSession.findUnique({ where: { session_token_hash: hash } });
    if (session) {
      await prisma.userSession.update({ where: { id: session.id }, data: { revoked_at: new Date() } });
      await accessLog({ user_id: session.userId, vendor_id: 'unknown', event_type: 'LOGOUT' });
    }
  }
  const response = NextResponse.json({ status: 'logged_out' });
  response.cookies.set(SESSION_COOKIE, '', { httpOnly: true, maxAge: 0, path: '/' });
  return response;
}
