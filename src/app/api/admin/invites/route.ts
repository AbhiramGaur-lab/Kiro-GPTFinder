import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { requireCsrf, getSessionUser, ensureRole } from '../../../../lib/auth';
import { auditLog } from '../../../../lib/logging';
import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    requireCsrf(req);
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    ensureRole(user.role as UserRole, [UserRole.ADMIN, UserRole.SUPER_ADMIN]);

    const { email, vendorId } = await req.json();
    const token = Math.random().toString(36).slice(2);
    const invite = await prisma.invite.create({
      data: {
        email,
        vendorId,
        role: UserRole.VENDOR,
        token_hash: await bcrypt.hash(token, 10),
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
        createdById: user.id
      }
    });
    await auditLog({ actor_user_id: user.id, vendor_id: vendorId, action: 'invite_user', target_type: 'invite', target_id: invite.id });
    return NextResponse.json({ status: 'invite_created', token });
  } catch (error) {
    return NextResponse.json({ error: 'invite_failed' }, { status: 400 });
  }
}
