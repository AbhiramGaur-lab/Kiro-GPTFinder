import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { hashPassword } from '../../../../lib/auth';
import { rateLimit } from '../../../../lib/rate-limit';
import { VendorStatus, UserRole, UserStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anon';
  const rate = rateLimit(`signup:${ip}`);
  if (!rate.allowed) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

  const body = await req.json();
  const { vendorName, email, password } = body;
  if (!vendorName || !email || !password) return NextResponse.json({ error: 'invalid_request' }, { status: 400 });

  const passwordHash = await hashPassword(password);
  const vendor = await prisma.vendor.create({ data: { name: vendorName, status: VendorStatus.PENDING } });
  await prisma.user.create({
    data: {
      email,
      password_hash: passwordHash,
      role: UserRole.VENDOR,
      status: UserStatus.PENDING,
      vendorId: vendor.id
    }
  });

  return NextResponse.json({ status: 'pending_approval', vendorId: vendor.id });
}
