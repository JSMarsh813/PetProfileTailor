// migrations/add-read-field.js
import "dotenv/config";
import db from "../utils/db.js";
import NameLikes from "../models/NameLikes.js";

await db.connect();
console.log("✅ Connected to MongoDB");

try {
  // Step 1: Add the new field `read` with default false, if missing
  const result = await NameLikes.collection.updateMany(
    { read: { $exists: false } }, // only add if not already present
    { $set: { read: false } },
  );

  console.log(`✅ Added 'read' field to ${result.modifiedCount} documents.`);

  // Step 2: Verify with a sample document
  const check = await NameLikes.collection.findOne({});
  console.log("🔎 Sample document:", check);
} catch (err) {
  console.error("❌ Migration failed:", err);
}

await db.disconnect();
console.log("✅ Disconnected from MongoDB");
