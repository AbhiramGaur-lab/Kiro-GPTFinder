import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { hashPassword } from '../../../../lib/auth';
import { rateLimit } from '../../../../lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anon';
  const rate = rateLimit(`reset:${ip}`);
  if (!rate.allowed) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

  const { token, password } = await req.json();
  const reset = await prisma.userSession.findUnique({ where: { session_token_hash: token } });
  if (!reset || reset.expires_at < new Date()) return NextResponse.json({ error: 'invalid_token' }, { status: 400 });

  await prisma.user.update({ where: { id: reset.userId }, data: { password_hash: await hashPassword(password) } });
  await prisma.userSession.update({ where: { id: reset.id }, data: { revoked_at: new Date() } });
  return NextResponse.json({ status: 'password_updated' });
}
