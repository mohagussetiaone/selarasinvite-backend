// customCSRF.ts
import { Context } from "hono";
import { getCookie } from "hono/cookie";

// Daftar domain yang diizinkan
const allowedOrigins = [
  "https://selarasinvite.vercel.app",
  "http://localhost:3000",
];

// Validasi origin
const originValidator = (origin: string) => {
  console.log("Validating origin:", origin); // Ini akan muncul di console saat test dijalankan
  if (allowedOrigins.includes(origin)) return true;
  if (origin && origin.startsWith("chrome-extension://")) return true;
  return false;
};

export const customCSRF = async (c: Context, next: Function) => {
  const allowedMethods = ["GET", "HEAD", "OPTIONS"];
  const method = c.req.method;
  const origin = c.req.header("Origin");

  // Untuk method yang tidak mengubah state, lewati pengecekan
  if (allowedMethods.includes(method)) {
    return next();
  }

  // Validasi origin
  if (!origin || !allowedOrigins.includes(origin)) {
    return c.text("Forbidden: Invalid origin", 403);
  }

  // Validasi CSRF token
  const csrfTokenFromHeader = c.req.header("X-CSRF-Token");
  const csrfTokenFromCookie = getCookie(c, "csrf-token");

  if (!csrfTokenFromHeader || csrfTokenFromHeader !== csrfTokenFromCookie) {
    return c.text("Forbidden: CSRF token invalid", 403);
  }

  await next();
};
