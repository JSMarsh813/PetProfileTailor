// migrations/remove-followers-array.js
import "dotenv/config";
import mongoose from "mongoose";
import db from "../utils/db.js";
import User from "../models/User.js";

async function removeFollowersArray() {
  await db.connect();
  console.log("✅ Connected to MongoDB");

  try {
    const result = await User.updateMany({}, { $unset: { followers: "" } });
    console.log(
      `🎉 Migration complete! Matched ${result.matchedCount}, modified ${result.modifiedCount} users.`,
    );
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
    process.exit();
  }
}

removeFollowersArray();
