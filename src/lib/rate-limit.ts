type Key = string;

interface LimitOptions {
  windowMs: number; // time window in ms
  max: number; // max requests per window
}

const buckets = new Map<Key, { count: number; resetAt: number }>();

export function rateLimit(key: Key, opts: LimitOptions) {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || now >= existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { allowed: true, remaining: opts.max - 1, resetAt: now + opts.windowMs };
  }
  if (existing.count >= opts.max) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }
  existing.count += 1;
  return { allowed: true, remaining: opts.max - existing.count, resetAt: existing.resetAt };
}

export function formatRateLimitHeaders(result: { remaining: number; resetAt: number }, opts: LimitOptions) {
  const retryAfter = Math.max(0, Math.ceil((result.resetAt - Date.now()) / 1000));
  return {
    'X-RateLimit-Limit': String(opts.max),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
    'Retry-After': String(retryAfter),
  } as Record<string, string>;
}
