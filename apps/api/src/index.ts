import { Elysia } from "elysia";
import { cookie } from "@elysiajs/cookie";
import { cors } from "@elysiajs/cors";

const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";
const PORT = Number(process.env.PORT) || 3001;

const app = new Elysia()
  .use(cookie())
  .use(
    cors({
      origin: FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    }),
  )
  .get("/api/health", () => ({ status: "ok", timestamp: new Date().toISOString() }))
  .listen(PORT);

console.log(`API running at http://localhost:${app.server?.port}`);

export type App = typeof app;
