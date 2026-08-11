import { jwt } from "@elysiajs/jwt";
import { Elysia } from "elysia";

const SESSION_SECRET = process.env.SESSION_SECRET ?? "dev-secret-change-in-production";

export const sessionJwt = jwt({
  name: "sessionJwt",
  secret: SESSION_SECRET,
});

export const authGuard = new Elysia({ name: "auth-guard" })
  .use(sessionJwt)
  .macro(({ onBeforeHandle }) => {
    onBeforeHandle(async ({ cookie, sessionJwt, set }) => {
      const token = cookie.session?.value;

      if (!token) {
        set.status = 401;
        return { error: "Unauthorized" };
      }

      const payload = await sessionJwt.verify({ token });

      if (!payload) {
        set.status = 401;
        return { error: "Invalid session" };
      }

      return true;
    });
  });
