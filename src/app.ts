import { Hono } from "hono";
import { cors } from "hono/cors";
import UserRoute from "@/routes/UserRoute";
// import Log from "@/utils/Logger";
import { Scalar } from "@scalar/hono-api-reference";
import { csrf } from "hono/csrf";
// import { customCSRF } from "./middleware/csrf";
import { rateLimit } from "@/middleware/rate-limiting";
import { openAPIDocument } from "./openapi";

interface Env {
  ENVIRONMENT?: string;
}

const app = new Hono<{ Bindings: Env }>();

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

app.use(
  csrf({
    origin: originValidator,
  }),
);

// PASANG CORS DULU
app.use("*", cors());

// Endpoint test
app.get("/api/test", (c) => {
  return c.json({ message: "Test endpoint for CSRF" });
});

app.post("/api/test-endpoint", async (c) => {
  return c.json({
    message: "POST request successful",
    data: await c.req.json(),
  });
});

app.use("/api/test-endpoint", csrf({ origin: originValidator }));
app.use("/api/*", csrf({ origin: originValidator }));

// Middleware lainnya
app.use(
  "/api/*",
  rateLimit({
    windowMs: 60000,
    max: 100,
    message: "Too Many Requests",
  }),
);

app.route("/api", UserRoute);
app.get("/api/test-rate-limit", (c) => {
  return c.json({
    message: "Test endpoint for rate limiting",
    timestamp: new Date().toISOString(),
  });
});

app.get(
  "/docs",
  Scalar(() => ({
    title: "Wedding Invitation API Documentation",
    theme: "purple",
    spec: {
      url: "/doc",
    },
  })),
);

app.get("/doc", (c) => c.json(openAPIDocument));

app.onError((err, c) => {
  // Log.error(
  //   "Unhandled error " +
  //     {
  //       error: err.message,
  //       stack: err.stack,
  //     },
  // );
  return c.text("Internal Server Error", 500);
});

export default app;
