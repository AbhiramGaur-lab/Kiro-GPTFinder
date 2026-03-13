const WINDOW_MS = 60 * 1000;
const LIMIT = 10;
const store = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string) {
  const now = Date.now();
  const bucket = store.get(key);
  if (!bucket || bucket.reset < now) {
    store.set(key, { count: 1, reset: now + WINDOW_MS });
    return { allowed: true };
  }
  if (bucket.count >= LIMIT) {
    return { allowed: false, retryAfter: bucket.reset - now };
  }
  bucket.count += 1;
  return { allowed: true };
}
