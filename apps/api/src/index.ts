import { connectDB } from "@/db";
import { appointmentRoutes } from "@/routes/appointments";
import { authRoutes } from "@/routes/auth";
import { conversationRoutes } from "@/routes/conversations";
import { galleryRoutes } from "@/routes/gallery";
import { heroImageRoutes } from "@/routes/hero-images";
import { cookie } from "@elysiajs/cookie";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

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
  .use(authRoutes)
  .use(heroImageRoutes)
  .use(galleryRoutes)
  .use(conversationRoutes)
  .use(appointmentRoutes)
  .get("/api/health", () => ({ status: "ok", timestamp: new Date().toISOString() }));

await connectDB();

app.listen(PORT);

console.log(`API running at http://localhost:${app.server?.port}`);

export type App = typeof app;
