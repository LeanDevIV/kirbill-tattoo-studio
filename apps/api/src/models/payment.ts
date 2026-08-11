import { type InferSchemaType, Schema, model } from "mongoose";

const paymentSchema = new Schema(
  {
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment" },
    clientEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export type PaymentDoc = InferSchemaType<typeof paymentSchema>;
export const PaymentModel = model("Payment", paymentSchema);
