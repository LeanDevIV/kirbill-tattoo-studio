import { sessionJwt } from "@/middleware/auth";
import { UserModel } from "@/models/user";
import bcrypt from "bcryptjs";
import { type Elysia, t } from "elysia";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24,
};

export function authRoutes(app: Elysia): Elysia {
  return app.use(sessionJwt).group("/api/auth", (group) =>
    group
      .post(
        "/login",
        async ({ body, cookie, sessionJwt, set }) => {
          const { username, password } = body;

          const user = await UserModel.findOne({ username }).lean();

          if (!user) {
            set.status = 401;
            return { error: "Invalid credentials" };
          }

          const isValidPassword = await bcrypt.compare(password, user.passwordHash);

          if (!isValidPassword) {
            set.status = 401;
            return { error: "Invalid credentials" };
          }

          const token = await sessionJwt.sign({
            sub: user._id.toString(),
            username: user.username,
          });

          cookie.session.set({
            value: token,
            ...COOKIE_OPTIONS,
          });

          return { user: { _id: user._id, username: user.username } };
        },
        {
          body: t.Object({
            username: t.String(),
            password: t.String(),
          }),
        },
      )
      .post("/logout", async ({ cookie, set }) => {
        cookie.session.remove();
        set.status = 200;
        return { message: "Logged out" };
      })
      .get("/me", async ({ cookie, set }) => {
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

        const user = await UserModel.findById(payload.sub).select("-passwordHash").lean();

        if (!user) {
          set.status = 401;
          return { error: "User not found" };
        }

        return { user: { _id: user._id.toString(), username: user.username } };
      }),
  );
}
