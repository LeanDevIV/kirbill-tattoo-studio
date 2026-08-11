import { Elysia, t } from "elysia";
import { HeroImageModel } from "@/models/hero-image";
import { authGuard } from "@/middleware/auth";

export function heroImageRoutes(app: Elysia): Elysia {
  return app
    .get("/api/hero-images", async () => {
      const images = await HeroImageModel.find({ isActive: true })
        .sort({ order: 1, createdAt: -1 })
        .lean();

      return { images };
    })
    .guard(authGuard, (group) =>
      group
        .post(
          "/api/hero-images",
          async ({ body }) => {
            const image = await HeroImageModel.create(body);
            return { image };
          },
          {
            body: t.Object({
              imageUrl: t.String(),
              order: t.Optional(t.Number()),
              isActive: t.Optional(t.Boolean()),
            }),
          },
        )
        .put(
          "/api/hero-images/:id",
          async ({ params, body, set }) => {
            const image = await HeroImageModel.findByIdAndUpdate(
              params.id,
              { $set: body },
              { new: true },
            ).lean();

            if (!image) {
              set.status = 404;
              return { error: "Image not found" };
            }

            return { image };
          },
          {
            body: t.Object({
              order: t.Optional(t.Number()),
              isActive: t.Optional(t.Boolean()),
            }),
          },
        )
        .delete("/api/hero-images/:id", async ({ params, set }) => {
          const image = await HeroImageModel.findByIdAndDelete(params.id);

          if (!image) {
            set.status = 404;
            return { error: "Image not found" };
          }

          return { message: "Image deleted" };
        }),
    );
}
