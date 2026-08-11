import { Elysia, t } from "elysia";
import { GalleryImageModel } from "@/models/gallery-image";
import { authGuard } from "@/middleware/auth";

export function galleryRoutes(app: Elysia): Elysia {
  return app
    .get("/api/gallery", async () => {
      const images = await GalleryImageModel.find({ isActive: true })
        .sort({ order: 1, createdAt: -1 })
        .lean();

      return { images };
    })
    .guard(authGuard, (group) =>
      group
        .post(
          "/api/gallery",
          async ({ body }) => {
            const image = await GalleryImageModel.create(body);
            return { image };
          },
          {
            body: t.Object({
              imageUrl: t.String(),
              title: t.Optional(t.String()),
              category: t.Optional(t.String()),
              order: t.Optional(t.Number()),
              isActive: t.Optional(t.Boolean()),
            }),
          },
        )
        .put(
          "/api/gallery/:id",
          async ({ params, body, set }) => {
            const image = await GalleryImageModel.findByIdAndUpdate(
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
              title: t.Optional(t.String()),
              category: t.Optional(t.String()),
              order: t.Optional(t.Number()),
              isActive: t.Optional(t.Boolean()),
            }),
          },
        )
        .delete("/api/gallery/:id", async ({ params, set }) => {
          const image = await GalleryImageModel.findByIdAndDelete(params.id);

          if (!image) {
            set.status = 404;
            return { error: "Image not found" };
          }

          return { message: "Image deleted" };
        }),
    );
}
