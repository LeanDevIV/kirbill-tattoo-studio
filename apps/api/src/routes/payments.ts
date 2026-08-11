import { Elysia, t } from "elysia";
import { PaymentModel } from "@/models/payment";
import { authGuard } from "@/middleware/auth";

export function paymentRoutes(app: Elysia): Elysia {
  return app.guard(authGuard, (group) =>
    group
      .get("/api/payments", async ({ query }) => {
        const filter: Record<string, unknown> = {};

        if (query.status) {
          filter.status = query.status;
        }

        const payments = await PaymentModel.find(filter).sort({ createdAt: -1 }).lean();

        return { payments };
      })
      .post(
        "/api/payments",
        async ({ body }) => {
          const payment = await PaymentModel.create(body);
          return { payment };
        },
        {
          body: t.Object({
            appointmentId: t.Optional(t.String()),
            clientEmail: t.String(),
            amount: t.Number(),
            status: t.Optional(
              t.Union([
                t.Literal("pending"),
                t.Literal("paid"),
                t.Literal("cancelled"),
                t.Literal("refunded"),
              ]),
            ),
          }),
        },
      )
      .put(
        "/api/payments/:id",
        async ({ params, body, set }) => {
          const payment = await PaymentModel.findByIdAndUpdate(
            params.id,
            { $set: body },
            { new: true },
          ).lean();

          if (!payment) {
            set.status = 404;
            return { error: "Payment not found" };
          }

          return { payment };
        },
        {
          body: t.Object({
            amount: t.Optional(t.Number()),
            status: t.Optional(
              t.Union([
                t.Literal("pending"),
                t.Literal("paid"),
                t.Literal("cancelled"),
                t.Literal("refunded"),
              ]),
            ),
          }),
        },
      )
      .delete("/api/payments/:id", async ({ params, set }) => {
        const payment = await PaymentModel.findByIdAndDelete(params.id);

        if (!payment) {
          set.status = 404;
          return { error: "Payment not found" };
        }

        return { message: "Payment deleted" };
      }),
  );
}
