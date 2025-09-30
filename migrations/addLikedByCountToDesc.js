import "dotenv/config";
import db from "../utils/db.js";
import Descriptions from "../models/Description.js";

await db.connect();
console.log("✅ Connected to MongoDB");

try {
  // Step 1: Add the new field likedByCount with default 0
  const result = await Descriptions.collection.updateMany(
    { likedByCount: { $exists: false } }, // only add if not already present
    { $set: { likedByCount: 0 } },
  );

  console.log(`✅ Added likedByCount to ${result.modifiedCount} documents.`);

  // Step 2: Verify a sample
  const check = await Descriptions.collection.findOne({});
  console.log("🔎 Sample document:", check);
} catch (err) {
  console.error("❌ Migration failed:", err);
}

await db.disconnect();
console.log("✅ Disconnected from MongoDB");
