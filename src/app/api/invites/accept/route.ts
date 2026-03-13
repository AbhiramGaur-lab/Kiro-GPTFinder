import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { hashPassword } from '../../../../lib/auth';
import bcrypt from 'bcryptjs';
import { UserRole, UserStatus } from '@prisma/client';
import { rateLimit } from '../../../../lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anon';
  const rate = rateLimit(`invite:${ip}`);
  if (!rate.allowed) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

  const { token, email, password } = await req.json();
  const invites = await prisma.invite.findMany({ where: { email } });
  const invite = invites.find((i) => bcrypt.compareSync(token, i.token_hash));
  if (!invite || invite.expires_at < new Date()) return NextResponse.json({ error: 'invalid_invite' }, { status: 400 });

  const user = await prisma.user.upsert({
    where: { email },
    update: { password_hash: await hashPassword(password), status: UserStatus.ACTIVE, vendorId: invite.vendorId, role: UserRole.VENDOR },
    create: { email, password_hash: await hashPassword(password), status: UserStatus.ACTIVE, vendorId: invite.vendorId, role: UserRole.VENDOR }
  });
  await prisma.invite.update({ where: { id: invite.id }, data: { accepted_at: new Date() } });
  return NextResponse.json({ status: 'accepted', userId: user.id });
}
