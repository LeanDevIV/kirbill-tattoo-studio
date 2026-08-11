import { type InferSchemaType, Schema, model } from "mongoose";

const conversationSchema = new Schema(
  {
    clientEmail: { type: String, required: true, index: true },
    clientName: { type: String, default: "" },
    status: {
      type: String,
      enum: ["active", "closed"],
      default: "active",
    },
    lastMessageAt: { type: Date },
  },
  { timestamps: true },
);

export type ConversationDoc = InferSchemaType<typeof conversationSchema>;
export const ConversationModel = model("Conversation", conversationSchema);
