import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { rateLimit } from '../../../../lib/rate-limit';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anon';
  const rate = rateLimit(`forgot:${ip}`);
  if (!rate.allowed) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

  const { email } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ status: 'ok' });
  const token = await bcrypt.hash(`${email}-${Date.now()}`, 6);
  await prisma.userSession.create({
    data: {
      userId: user.id,
      session_token_hash: token,
      expires_at: new Date(Date.now() + 1000 * 60 * 30)
    }
  });
  return NextResponse.json({ status: 'reset_sent' });
}
