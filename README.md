# Enterprise Vendor Analytics Portal

A Next.js (App Router) + PostgreSQL portal for multi-tenant Zoho Analytics embedding with RBAC, approval-based onboarding, audit/access logging, and plan enforcement scaffolding.

## Features
- Vendor isolation with Prisma schema and tenant-scoped associations.
- RBAC with SUPER_ADMIN, ADMIN, and VENDOR roles plus permission matrix utilities.
- Approval-based signup and admin invites with token-based acceptance.
- Compliance logging: append-only audit and access logs, CSV-ready via Prisma queries.
- Plan + subscription tables for FREE and PREMIUM with JSONB feature flags.
- Health/readiness endpoints, CSRF/session scaffolding, rate limiting, and CSP tuned for Zoho iframes.
- Dockerfile and docker-compose for production-ready deployment.

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set environment variables (see `.env.example` pattern below) or export them directly.
3. Run Prisma migrations and seed data:
   ```bash
   npx prisma migrate dev --name init
   npm run seed
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

### Environment Variables
- `DATABASE_URL` – PostgreSQL connection string.
- `COOKIE_SECRET` – secret for signing session tokens.
- `APP_URL` – optional public URL for callbacks.
- `ENABLE_MFA_PLACEHOLDER` – optional flag for MFA-ready UI toggles.

### API Surface
- `POST /api/auth/signup` – creates pending vendor + user awaiting approval.
- `POST /api/auth/login` – CSRF-protected session cookie, rate limited.
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/admin/approvals/:id/approve`
- `POST /api/admin/approvals/:id/reject`
- `POST /api/admin/invites`
- `POST /api/invites/accept`
- `GET /api/health` – DB connectivity check.
- `GET /api/ready` – confirms migrations applied.

### Database Seed
`npm run seed` creates:
- SUPER_ADMIN (superadmin@example.com / ChangeMeSuper!)
- ADMIN (admin@example.com / ChangeMeAdmin!)
- Active vendor on FREE with active vendor user
- Pending vendor signup and trialing subscription
- Four reports with two assigned to active vendor
- Pending invite and settings row

### Deployment
- `Dockerfile` builds the Next.js app in production mode.
- `docker-compose.yml` provides app + PostgreSQL stack and runs migrations on start.
- Configure CSP for Zoho domains in `src/lib/security-headers.js` or via settings table.

### Compliance & Observability
- JSON structured logging via Prisma client and Next.js runtime output.
- Append-only audit/access logs for admin actions and report access events.
- Health and readiness endpoints for probes.
