import "dotenv/config";
import mongoose from "mongoose";
import db from "../utils/db.js";
import User from "../models/User.js";

async function migrate() {
  await db.connect();
  console.log("✅ Connected to MongoDB");

  // Update all users that don’t already have these fields
  const result = await User.updateMany(
    {
      $or: [{ status: { $exists: false } }, { role: { $exists: false } }],
    },
    {
      $set: {
        status: "active", // default value
        role: "user", // default value
      },
    },
  );

  console.log(`✅ Migration complete. Modified ${result.modifiedCount} users.`);

  await db.disconnect();
  process.exit();
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
