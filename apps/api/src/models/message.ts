import { type InferSchemaType, Schema, model } from "mongoose";

const messageSchema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true, index: true },
  sender: { type: String, enum: ["client", "admin"], required: true },
  text: { type: String, default: "" },
  imageUrl: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export type MessageDoc = InferSchemaType<typeof messageSchema>;
export const MessageModel = model("Message", messageSchema);
