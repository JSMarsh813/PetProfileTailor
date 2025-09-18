// migrations/migrate-followers-to-follows.js
import "dotenv/config";
import mongoose from "mongoose";
import db from "../utils/db.js";
import User from "../models/User.js";
import Follows from "../models/Follows.js";

async function migrateFollowers() {
  await db.connect();
  console.log("✅ Connected to MongoDB");

  try {
    const users = await User.find({}, "_id followers").lean();
    console.log(`Found ${users.length} users.`);

    let totalCreated = 0;

    for (const user of users) {
      const userId = user._id;
      const followers = user.followers || [];

      const followsToInsert = followers.map((followerId) => ({
        userId, // the user being followed
        followedBy: followerId, // the follower
      }));

      if (followsToInsert.length > 0) {
        // Use insertMany with { ordered: false } to continue if duplicates exist
        const result = await Follows.insertMany(followsToInsert, {
          ordered: false,
        });
        totalCreated += result.length;
        console.log(`✅ Created ${result.length} follows for user ${userId}`);
      }
    }

    console.log(
      `🎉 Migration complete! Total follows created: ${totalCreated}`,
    );
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
    process.exit();
  }
}

migrateFollowers();
