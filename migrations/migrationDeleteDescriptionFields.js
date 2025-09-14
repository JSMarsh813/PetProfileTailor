import "dotenv/config";
import db from "../utils/db.js";
import Descriptions from "../models/Description.js";

await db.connect();
console.log("✅ Connected to MongoDB");

try {
  // Step 1: Drop any old indexes on these fields
  const indexes = await Descriptions.collection.indexes();
  for (const i of indexes) {
    if (i.key.shares || i.key.flaggedby) {
      await Descriptions.collection.dropIndex(i.name);
      console.log(`✅ Dropped index: ${i.name}`);
    }
  }

  // Step 2: Remove old fields using $unset
  const result = await Descriptions.collection.updateMany(
    {},
    { $unset: { shares: "", flaggedby: "" } },
  );

  console.log(`✅ Removed old fields from ${result.modifiedCount} documents.`);

  // Step 3: Verify
  const check = await Descriptions.collection.findOne({
    $or: [{ shares: { $exists: true } }, { flaggedby: { $exists: true } }],
  });

  if (!check) {
    console.log("✅ All old fields successfully removed.");
  } else {
    console.log("⚠️ Some documents still have old fields:", check);
  }
} catch (err) {
  console.error("❌ Migration failed:", err);
}

await db.disconnect();
console.log("✅ Disconnected from MongoDB");
