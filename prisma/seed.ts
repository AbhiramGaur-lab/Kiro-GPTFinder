import { PrismaClient, UserRole, UserStatus, VendorStatus, VendorReportStatus, SubscriptionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const freePlan = await prisma.plan.upsert({
    where: { code: 'FREE' },
    update: {},
    create: {
      code: 'FREE',
      name: 'Free',
      max_reports: 2,
      max_users: 2,
      featureFlags: { reports: true }
    }
  });

  const premiumPlan = await prisma.plan.upsert({
    where: { code: 'PREMIUM' },
    update: {},
    create: {
      code: 'PREMIUM',
      name: 'Premium',
      max_reports: 10,
      max_users: 20,
      featureFlags: { reports: true, audit: true }
    }
  });

  const activeVendor = await prisma.vendor.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Acme Analytics Partner',
      status: VendorStatus.ACTIVE,
      planId: freePlan.id
    }
  });

  const pendingVendor = await prisma.vendor.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Pending Vendor',
      status: VendorStatus.PENDING,
      planId: freePlan.id
    }
  });

  await prisma.subscription.upsert({
    where: { id: '00000000-0000-0000-0000-000000000011' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000011',
      vendorId: activeVendor.id,
      status: SubscriptionStatus.ACTIVE,
      current_period_end: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    }
  });

  await prisma.subscription.upsert({
    where: { id: '00000000-0000-0000-0000-000000000012' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000012',
      vendorId: pendingVendor.id,
      status: SubscriptionStatus.TRIALING,
      trial_end: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)
    }
  });

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: {},
    create: {
      email: 'superadmin@example.com',
      password_hash: await bcrypt.hash('ChangeMeSuper!', 10),
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE
    }
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password_hash: await bcrypt.hash('ChangeMeAdmin!', 10),
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE
    }
  });

  await prisma.user.upsert({
    where: { email: 'vendor@example.com' },
    update: {},
    create: {
      email: 'vendor@example.com',
      password_hash: await bcrypt.hash('ChangeMeVendor!', 10),
      role: UserRole.VENDOR,
      vendorId: activeVendor.id,
      status: UserStatus.ACTIVE
    }
  });

  await prisma.user.upsert({
    where: { email: 'pending@example.com' },
    update: {},
    create: {
      email: 'pending@example.com',
      password_hash: await bcrypt.hash('ChangeMePending!', 10),
      role: UserRole.VENDOR,
      vendorId: pendingVendor.id,
      status: UserStatus.PENDING
    }
  });

  await prisma.report.createMany({
    data: [
      { name: 'Sales Overview', description: 'Topline sales metrics', zoho_public_embed_url: 'https://analytics.zoho.com/open-report/sales', tags: ['sales'] },
      { name: 'Support Pulse', description: 'Tickets and response times', zoho_public_embed_url: 'https://analytics.zoho.com/open-report/support', tags: ['support'] },
      { name: 'Marketing ROI', description: 'Campaign performance', zoho_public_embed_url: 'https://analytics.zoho.com/open-report/marketing', tags: ['marketing'] },
      { name: 'Product Quality', description: 'Release and QA metrics', zoho_public_embed_url: 'https://analytics.zoho.com/open-report/quality', tags: ['quality'] }
    ],
    skipDuplicates: true
  });

  const reportList = await prisma.report.findMany({ take: 2 });
  await Promise.all(reportList.map((report) =>
    prisma.vendorReport.upsert({
      where: { vendorId_reportId: { vendorId: activeVendor.id, reportId: report.id } },
      update: {},
      create: {
        vendorId: activeVendor.id,
        reportId: report.id,
        status: VendorReportStatus.ACTIVE
      }
    })
  ));

  await prisma.invite.upsert({
    where: { id: '00000000-0000-0000-0000-000000000101' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000101',
      vendorId: activeVendor.id,
      email: 'invited@example.com',
      role: UserRole.VENDOR,
      token_hash: await bcrypt.hash('sample-token', 10),
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
      createdById: adminUser.id
    }
  });

  await prisma.setting.upsert({
    where: { id: '00000000-0000-0000-0000-000000000777' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000777',
      allowed_iframe_domains: ['https://analytics.zoho.com'],
      support_email: 'support@example.com',
      branding: { logo: 'Enterprise Portal' }
    }
  });

  console.log('Seed completed with sample data including Super Admin, Admin, vendor, and pending signup.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
