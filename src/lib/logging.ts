import { prisma } from './db';

export async function auditLog(data: {
  actor_user_id: string;
  vendor_id?: string | null;
  action: string;
  target_type: string;
  target_id?: string | null;
  metadata?: Record<string, unknown>;
}) {
  await prisma.auditLog.create({
    data: {
      ...data,
      metadata: data.metadata ?? {}
    }
  });
}

export async function accessLog(data: {
  user_id: string;
  vendor_id: string;
  report_id?: string | null;
  event_type: string;
  ip?: string | null;
  user_agent?: string | null;
}) {
  await prisma.accessLog.create({
    data
  });
}
