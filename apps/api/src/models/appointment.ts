import { type InferSchemaType, Schema, model } from "mongoose";

const appointmentSchema = new Schema(
  {
    clientEmail: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    amount: { type: Number, default: 0 },
    description: { type: String, default: "" },
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation" },
  },
  { timestamps: true },
);

export type AppointmentDoc = InferSchemaType<typeof appointmentSchema>;
export const AppointmentModel = model("Appointment", appointmentSchema);
