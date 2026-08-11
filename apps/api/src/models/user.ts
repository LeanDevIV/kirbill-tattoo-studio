import { type InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof userSchema>;
export const UserModel = model("User", userSchema);
