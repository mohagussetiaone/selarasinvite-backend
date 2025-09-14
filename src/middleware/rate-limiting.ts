import { createMiddleware } from "hono/factory";

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
}

// Fallback in-memory store untuk development jika KV tidak tersedia
class MemoryStore {
  private store: Map<string, { count: number; expiry: number }> = new Map();

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiry < Date.now()) {
      this.store.delete(key);
      return null;
    }
    return item.count.toString();
  }

  async put(
    key: string,
    value: string,
    options: { expirationTtl: number },
  ): Promise<void> {
    this.store.set(key, {
      count: parseInt(value),
      expiry: Date.now() + options.expirationTtl * 1000,
    });
  }
}

// Buat instance memory store untuk fallback
const memoryStore = new MemoryStore();

export const rateLimit = (config: RateLimitConfig) => {
  return createMiddleware(async (c, next) => {
    try {
      // Prioritaskan IP device (local/private IP) daripada internet IP
      const deviceIp =
        c.req.header("x-real-ip") || c.req.header("x-forwarded-for");
      const internetIp = c.req.header("cf-connecting-ip");

      // Gunakan device IP jika tersedia, jika tidak gunakan internet IP
      const ip = deviceIp || internetIp || "unknown";

      const key = `rate_limit:${c.req.path}:${ip}`;

      // Coba akses KV dari environment, jika tidak ada, gunakan memory store
      const kv = c.env?.RATE_LIMIT_KV ? c.env.RATE_LIMIT_KV : memoryStore;

      let current = 0;
      try {
        const currentValue = await kv.get(key);
        current = parseInt(currentValue || "0");
      } catch (e) {
        console.error("Error reading from KV:", e);
        // Jika error, lanjutkan tanpa rate limiting (atau bisa juga ditolak, tergantung kebijakan)
        // Untuk sementara, kita lanjutkan saja tanpa rate limit
        await next();
        return;
      }

      if (current >= config.max) {
        return c.json({ error: config.message || "Too Many Requests" }, 429);
      }

      current++;
      try {
        await kv.put(key, current.toString(), {
          expirationTtl: config.windowMs / 1000,
        });
      } catch (e) {
        console.error("Error writing to KV:", e);
        // Jika error menulis, kita tetap lanjutkan request tanpa melakukan rate limiting
      }

      await next();
    } catch (e) {
      console.error("Unexpected error in rate limit middleware:", e);
      // Jangan gagalkan request jika rate limit middleware error, lanjutkan saja
      await next();
    }
  });
};
