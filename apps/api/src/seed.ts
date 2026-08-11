import { connectDB, disconnectDB } from "@/db";
import { UserModel } from "@/models/user";
import bcrypt from "bcryptjs";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";

async function seed(): Promise<void> {
  await connectDB();

  const existingUser = await UserModel.findOne({ username: ADMIN_USERNAME });

  if (existingUser) {
    console.log("Admin user already exists");
    await disconnectDB();
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await UserModel.create({
    username: ADMIN_USERNAME,
    passwordHash,
  });

  console.log("Admin user created successfully");
  await disconnectDB();
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
