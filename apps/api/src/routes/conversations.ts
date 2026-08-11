import { Elysia, t } from "elysia";
import { ConversationModel } from "@/models/conversation";
import { MessageModel } from "@/models/message";
import { authGuard } from "@/middleware/auth";

export function conversationRoutes(app: Elysia): Elysia {
  return app.guard(authGuard, (group) =>
    group
      .get("/api/conversations", async () => {
        const conversations = await ConversationModel.find()
          .sort({ lastMessageAt: -1, createdAt: -1 })
          .lean();

        return { conversations };
      })
      .get("/api/conversations/:id", async ({ params, set }) => {
        const conversation = await ConversationModel.findById(params.id).lean();

        if (!conversation) {
          set.status = 404;
          return { error: "Conversation not found" };
        }

        const messages = await MessageModel.find({ conversationId: params.id })
          .sort({ timestamp: 1 })
          .lean();

        return { conversation, messages };
      })
      .put(
        "/api/conversations/:id",
        async ({ params, body, set }) => {
          const conversation = await ConversationModel.findByIdAndUpdate(
            params.id,
            { $set: body },
            { new: true },
          ).lean();

          if (!conversation) {
            set.status = 404;
            return { error: "Conversation not found" };
          }

          return { conversation };
        },
        {
          body: t.Object({
            status: t.Optional(t.Union([t.Literal("active"), t.Literal("closed")])),
          }),
        },
      ),
  );
}
