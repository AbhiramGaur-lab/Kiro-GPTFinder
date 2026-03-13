# Test Coverage Analysis

## Current State

**Test coverage: 0%** — The codebase has **zero test files**, no testing framework installed, and no test scripts in `package.json`. This is a significant risk for a production SaaS application handling authentication, multi-tenant data isolation, and role-based access control.

---

## Recommended Testing Strategy

### Priority 1 — Critical: Security & Auth (`src/lib/auth.ts`)

These functions guard every protected endpoint. Bugs here mean unauthorized access.

| Function | What to test |
|---|---|
| `verifyPassword` / `hashPassword` | Correct password matches, wrong password rejects, empty string handling |
| `signToken` | Deterministic output, different inputs produce different hashes |
| `createSession` | Session row created in DB, correct expiry (7 days), cookies set with proper flags (`httpOnly`, `secure`, `sameSite`) |
| `getSessionUser` | Returns user for valid token; returns `null` for missing token, expired session, revoked session |
| `revokeOtherSessions` | Revokes all sessions except the kept one; handles user with no other sessions |
| `requireCsrf` | Throws when header missing, cookie missing, or header !== cookie; passes when they match |
| `ensureRole` | Throws for disallowed roles; passes for allowed roles |
| `ensureActive` | Throws for `PENDING`/`DISABLED`; passes for `ACTIVE` |

### Priority 2 — Critical: RBAC (`src/lib/rbac.ts`)

Incorrect permissions = data leaks across tenants.

| What to test |
|---|
| `VENDOR` role has exactly `vendor.read_reports` and `vendor.read_profile` |
| `ADMIN` role has all vendor + admin permissions but no superadmin permissions |
| `SUPER_ADMIN` role has all 11 permissions |
| `hasPermission` returns `false` for permissions not in the role's list |
| `hasPermission` handles an unknown/invalid role gracefully (currently returns `undefined`) |

### Priority 3 — High: Rate Limiter (`src/lib/rate-limit.ts`)

Broken rate limiting exposes auth endpoints to brute-force attacks.

| What to test |
|---|
| First request is allowed |
| 10th request is allowed, 11th is blocked |
| After window expires (60s), requests are allowed again |
| Different keys are independent buckets |
| `retryAfter` value is positive and decreasing over time |

### Priority 4 — High: API Route Handlers

These are integration tests that should mock `prisma` and verify HTTP behavior.

#### Auth Routes

| Route | Key test cases |
|---|---|
| `POST /api/auth/login` | Valid credentials → 200 + session; wrong password → 401; inactive user → error; inactive vendor → 403; rate limiting → 429 |
| `POST /api/auth/signup` | Valid input → creates vendor (PENDING) + user (PENDING); missing fields → 400; rate limiting → 429; duplicate email handling |
| `POST /api/auth/forgot-password` | Existing email → creates reset session; non-existent email → still returns 200 (no user enumeration); rate limiting |
| `POST /api/auth/reset-password` | Valid token → updates password + revokes session; expired token → 400; invalid token → 400 |
| `POST /api/auth/logout` | Revokes current session; already-revoked session handling |

#### Admin Routes

| Route | Key test cases |
|---|---|
| `POST /api/admin/approvals/[id]/approve` | Admin can approve → vendor & users set to ACTIVE + audit log created; VENDOR role → rejected; missing CSRF → rejected; unauthenticated → 401 |
| `POST /api/admin/approvals/[id]/reject` | Same auth checks as approve; vendor & users set to DISABLED |
| `POST /api/admin/invites` | Creates invite with 24h expiry + audit log; VENDOR role → rejected; returns raw token to caller |

#### Invite Routes

| Route | Key test cases |
|---|---|
| `POST /api/invites/accept` | Valid token + email → creates/upserts user as ACTIVE; expired invite → 400; wrong token → 400; rate limiting |

### Priority 5 — Medium: Environment Validation (`src/lib/env.ts`)

| What to test |
|---|
| Valid env vars parse successfully |
| Missing `DATABASE_URL` throws zod error |
| `COOKIE_SECRET` shorter than 16 chars throws |
| Invalid URL format for `DATABASE_URL` throws |
| Optional fields (`NEXTAUTH_SECRET`, `APP_URL`, `ENABLE_MFA_PLACEHOLDER`) can be omitted |

### Priority 6 — Medium: Security Headers (`src/lib/security-headers.js`)

| What to test |
|---|
| CSP includes all 4 Zoho domains in `frame-src` |
| HSTS header has correct `max-age` and includes `preload` |
| All 5 headers are present in the returned array |
| `X-Frame-Options` is `SAMEORIGIN` |

### Priority 7 — Medium: Logging (`src/lib/logging.ts`)

| What to test |
|---|
| `auditLog` creates a record with correct fields; defaults `metadata` to `{}` when omitted |
| `accessLog` creates a record with correct fields; handles null `report_id` |

### Priority 8 — Lower: React Components & Pages

UI tests are less critical than the above but add confidence for regressions.

| What to test |
|---|
| `DashboardShell` renders navigation and children |
| Login page renders form fields and submits correctly |
| Admin pages enforce role-based visibility |

---

## Specific Bugs & Risks Discovered During Analysis

These issues should be covered by tests once written, and some warrant immediate fixes:

### 1. Weak invite token generation (`src/app/api/admin/invites/route.ts:16`)
```ts
const token = Math.random().toString(36).slice(2);
```
`Math.random()` is not cryptographically secure. This should use `crypto.randomBytes()` like session tokens do. A test should assert the token has sufficient entropy.

### 2. `hasPermission` returns `undefined` for unknown roles (`src/lib/rbac.ts:42`)
```ts
return rolePermissions[role]?.includes(permission);
```
If an invalid role is passed, this returns `undefined` (falsy but not `false`). A test should verify behavior for invalid roles, and the function should explicitly return `false`.

### 3. Rate limit store is in-memory (`src/lib/rate-limit.ts`)
The `Map` store resets on every server restart/redeploy and doesn't work across multiple server instances. Tests should document this limitation, and a TODO should be added for Redis-backed rate limiting in production.

### 4. No input validation on login (`src/app/api/auth/login/route.ts`)
The login route does not validate `email` or `password` presence before querying the DB. If `body.email` is `undefined`, Prisma will throw. Tests should cover malformed request bodies.

### 5. Forgot-password token is guessable (`src/app/api/auth/forgot-password/route.ts:14`)
```ts
const token = await bcrypt.hash(`${email}-${Date.now()}`, 6);
```
The reset token is a bcrypt hash of email + timestamp with a low cost factor. This isn't returned to the user (there's no email sending), so the feature appears incomplete. Tests should flag that no token is returned to the user.

### 6. Invite accept uses `bcrypt.compareSync` (`src/app/api/invites/accept/route.ts:15`)
Synchronous bcrypt blocks the event loop. Tests should at minimum document this, and the code should switch to `bcrypt.compare` (async).

---

## Recommended Setup

**Framework:** [Vitest](https://vitest.dev/) — fast, TypeScript-native, ESM-compatible, works well with Next.js.

**Install:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

**`vitest.config.ts`:**
```ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // use 'jsdom' for component tests
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**`package.json` scripts:**
```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
}
```

---

## Summary of Priorities

| Priority | Area | Risk if untested | Estimated effort |
|---|---|---|---|
| P1 | `auth.ts` (8 functions) | Unauthorized access, session hijacking | ~30 tests |
| P2 | `rbac.ts` (permissions matrix) | Cross-tenant data leaks | ~15 tests |
| P3 | `rate-limit.ts` | Brute-force attacks on auth | ~8 tests |
| P4 | API route handlers (9 routes) | Broken auth flows, data corruption | ~45 tests |
| P5 | `env.ts` (validation) | Silent misconfiguration in production | ~6 tests |
| P6 | `security-headers.js` | Missing security headers, XSS | ~5 tests |
| P7 | `logging.ts` (audit + access) | Missing compliance logs | ~6 tests |
| P8 | React components/pages | UI regressions | ~20 tests |
| **Total** | | | **~135 tests** |
