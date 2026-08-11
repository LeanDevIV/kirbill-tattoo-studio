import { type InferSchemaType, Schema, model } from "mongoose";

const galleryImageSchema = new Schema(
  {
    imageUrl: { type: String, required: true },
    title: { type: String, default: "" },
    category: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type GalleryImageDoc = InferSchemaType<typeof galleryImageSchema>;
export const GalleryImageModel = model("GalleryImage", galleryImageSchema);
