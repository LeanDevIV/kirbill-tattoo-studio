import { type InferSchemaType, Schema, model } from "mongoose";

const heroImageSchema = new Schema(
  {
    imageUrl: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type HeroImageDoc = InferSchemaType<typeof heroImageSchema>;
export const HeroImageModel = model("HeroImage", heroImageSchema);
