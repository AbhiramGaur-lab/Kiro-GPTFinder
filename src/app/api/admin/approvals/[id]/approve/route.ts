import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/db';
import { auditLog } from '../../../../../../lib/logging';
import { requireCsrf, getSessionUser, ensureRole } from '../../../../../../lib/auth';
import { UserRole, VendorStatus, UserStatus } from '@prisma/client';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireCsrf(req);
    const user = await getSessionUser(req);
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    ensureRole(user.role as UserRole, [UserRole.ADMIN, UserRole.SUPER_ADMIN]);

    const vendorId = params.id;
    const vendor = await prisma.vendor.update({ where: { id: vendorId }, data: { status: VendorStatus.ACTIVE } });
    await prisma.user.updateMany({ where: { vendorId, role: UserRole.VENDOR }, data: { status: UserStatus.ACTIVE } });
    await auditLog({ actor_user_id: user.id, vendor_id: vendorId, action: 'approve_vendor', target_type: 'vendor', target_id: vendorId });
    return NextResponse.json({ status: 'approved', vendor });
  } catch (error) {
    return NextResponse.json({ error: 'approval_failed' }, { status: 400 });
  }
}
