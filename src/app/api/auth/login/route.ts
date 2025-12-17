import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { createSession, verifyPassword, ensureActive } from '../../../../lib/auth';
import { rateLimit } from '../../../../lib/rate-limit';
import { accessLog } from '../../../../lib/logging';
import { UserRole, UserStatus, VendorStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anon';
  const rate = rateLimit(`login:${ip}`);
  if (!rate.allowed) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

  const body = await req.json();
  const { email, password } = body;
  const user = await prisma.user.findUnique({ where: { email }, include: { vendor: true } });
  if (!user) return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
  if (!(await verifyPassword(password, user.password_hash))) {
    return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
  }
  ensureActive(user.status as UserStatus);
  if (user.role === UserRole.VENDOR && user.vendor && user.vendor.status !== VendorStatus.ACTIVE) {
    return NextResponse.json({ error: 'vendor_inactive' }, { status: 403 });
  }

  const { csrfToken } = await createSession(user.id, req);
  await accessLog({ user_id: user.id, vendor_id: user.vendorId ?? 'none', event_type: 'LOGIN', ip, user_agent: req.headers.get('user-agent') ?? undefined });
  return NextResponse.json({ status: 'ok', csrfToken });
}
