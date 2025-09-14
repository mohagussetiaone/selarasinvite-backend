// rate-limiting.test.ts
import { describe, expect, test, mock, beforeEach } from "bun:test";
import { Hono } from "hono";
import { rateLimit } from "@/middleware/rate-limiting";

// Mock untuk KV namespace
const mockKV = {
  get: mock(),
  put: mock(),
};

describe("Rate Limiting Middleware", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let app: Hono<{ Bindings: { RATE_LIMIT_KV: any } }>;

  beforeEach(() => {
    app = new Hono();
    mockKV.get.mockReset();
    mockKV.put.mockReset();
  });

  test("should allow requests under limit with device IP", async () => {
    // Mock KV untuk mengembalikan hitungan saat ini
    mockKV.get.mockResolvedValue("5");
    mockKV.put.mockResolvedValue(undefined);

    app.use("*", rateLimit({ windowMs: 15000, max: 10 }));
    app.get("/test", (c) => c.text("OK"));

    // Simulasikan request dengan IP device (bukan internet IP)
    const req = new Request("http://localhost/test", {
      headers: {
        "x-real-ip": "192.168.1.100", // IP device/local
      },
    });

    const res = await app.fetch(req, { RATE_LIMIT_KV: mockKV });

    expect(res.status).toBe(200);
    expect(mockKV.put).toHaveBeenCalled(); // Pastikan counter diupdate
  });

  test("should block requests over limit with device IP", async () => {
    // Mock KV untuk mengembalikan hitungan yang sudah mencapai limit
    mockKV.get.mockResolvedValue("10");

    app.use("*", rateLimit({ windowMs: 15000, max: 10 }));
    app.get("/test", (c) => c.text("OK"));

    // Simulasikan request dengan IP device
    const req = new Request("http://localhost/test", {
      headers: {
        "x-real-ip": "192.168.1.100",
      },
    });

    const res = await app.fetch(req, { RATE_LIMIT_KV: mockKV });

    expect(res.status).toBe(429);
  });

  test("should use device IP instead of internet IP", async () => {
    mockKV.get.mockResolvedValue(null);
    mockKV.put.mockResolvedValue(undefined);

    app.use("*", rateLimit({ windowMs: 15000, max: 10 }));
    app.get("/test", (c) => c.text("OK"));

    // Request dengan kedua jenis IP
    const req = new Request("http://localhost/test", {
      headers: {
        "cf-connecting-ip": "203.0.113.1", // Internet IP
        "x-real-ip": "192.168.1.100", // Device IP (seharusnya yang diprioritaskan)
      },
    });

    await app.fetch(req, { RATE_LIMIT_KV: mockKV });

    // Pastikan key menggunakan device IP, bukan internet IP
    expect(mockKV.put).toHaveBeenCalledWith(
      "rate_limit:/test:192.168.1.100",
      "1",
      expect.anything(),
    );
  });
});
