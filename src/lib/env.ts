import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().optional(),
  COOKIE_SECRET: z.string().min(16),
  APP_URL: z.string().url().optional(),
  ENABLE_MFA_PLACEHOLDER: z.string().optional(),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  APP_URL: process.env.APP_URL,
  ENABLE_MFA_PLACEHOLDER: process.env.ENABLE_MFA_PLACEHOLDER,
});
