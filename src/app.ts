import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel"; // Pastikan mengimpor handle dari hono/vercel
import { csrf } from "hono/csrf";
import { rateLimit } from "@/middleware/rate-limiting";
import UserRoute from "@/routes/UserRoute";

interface Env {
  ENVIRONMENT?: string;
}

const app = new Hono<{ Bindings: Env }>().basePath("/api");

// Daftar domain yang diizinkan
const allowedOrigins = [
  "https://selarasinvite.vercel.app",
  "http://localhost:3000",
];

// Validasi origin
const originValidator = (origin: string | undefined) => {
  if (!origin) return false;
  if (allowedOrigins.includes(origin)) return true;
  if (origin.startsWith("chrome-extension://")) return true;
  return false;
};

// Middleware CORS harus dipasang pertama
app.use(
  "*",
  cors({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    origin: originValidator as any,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    credentials: true,
  }),
);

// Middleware CSRF
app.use(
  "*",
  csrf({
    origin: originValidator,
  }),
);

// Middleware Rate Limiting
app.use(
  "*",
  rateLimit({
    windowMs: 60000,
    max: 100,
    message: "Too Many Requests",
  }),
);

// Endpoint test
app.get("/test", (c) => {
  return c.json({ message: "Test endpoint for CSRF" });
});

app.post("/test-endpoint", async (c) => {
  return c.json({
    message: "POST request successful",
    data: await c.req.json(),
  });
});

// Route API
app.route("/", UserRoute);

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling
app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json({ error: "Internal Server Error" }, 500);
});

// Not found handler
app.notFound((c) => {
  return c.json({ error: "Route not found" }, 404);
});

// Export untuk Vercel
export default handle(app);
