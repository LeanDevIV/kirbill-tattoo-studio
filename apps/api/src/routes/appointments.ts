import { Elysia, t } from "elysia";
import { AppointmentModel } from "@/models/appointment";
import { authGuard } from "@/middleware/auth";

export function appointmentRoutes(app: Elysia): Elysia {
  return app.guard(authGuard, (group) =>
    group
      .get("/api/appointments", async ({ query }) => {
        const filter: Record<string, unknown> = {};

        if (query.status) {
          filter.status = query.status;
        }

        if (query.date) {
          const startDate = new Date(query.date);
          const endDate = new Date(query.date);
          endDate.setHours(23, 59, 59, 999);
          filter.date = { $gte: startDate, $lte: endDate };
        }

        const appointments = await AppointmentModel.find(filter).sort({ date: -1, time: 1 }).lean();

        return { appointments };
      })
      .post(
        "/api/appointments",
        async ({ body }) => {
          const appointment = await AppointmentModel.create(body);
          return { appointment };
        },
        {
          body: t.Object({
            clientEmail: t.String(),
            date: t.String(),
            time: t.String(),
            status: t.Optional(
              t.Union([
                t.Literal("pending"),
                t.Literal("confirmed"),
                t.Literal("cancelled"),
                t.Literal("completed"),
              ]),
            ),
            amount: t.Optional(t.Number()),
            description: t.Optional(t.String()),
            conversationId: t.Optional(t.String()),
          }),
        },
      )
      .put(
        "/api/appointments/:id",
        async ({ params, body, set }) => {
          const appointment = await AppointmentModel.findByIdAndUpdate(
            params.id,
            { $set: body },
            { new: true },
          ).lean();

          if (!appointment) {
            set.status = 404;
            return { error: "Appointment not found" };
          }

          return { appointment };
        },
        {
          body: t.Object({
            clientEmail: t.Optional(t.String()),
            date: t.Optional(t.String()),
            time: t.Optional(t.String()),
            status: t.Optional(
              t.Union([
                t.Literal("pending"),
                t.Literal("confirmed"),
                t.Literal("cancelled"),
                t.Literal("completed"),
              ]),
            ),
            amount: t.Optional(t.Number()),
            description: t.Optional(t.String()),
          }),
        },
      )
      .delete("/api/appointments/:id", async ({ params, set }) => {
        const appointment = await AppointmentModel.findByIdAndDelete(params.id);

        if (!appointment) {
          set.status = 404;
          return { error: "Appointment not found" };
        }

        return { message: "Appointment deleted" };
      }),
  );
}
