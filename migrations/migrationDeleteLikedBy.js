import "dotenv/config";
import db from "../utils/db.js";
import Names from "../models/Name.js";

await db.connect();
console.log("✅ Connected to MongoDB");

try {
  // Step 1: Drop any old index
  const indexes = await Names.collection.indexes();
  for (const i of indexes) {
    if (i.key.likedby) {
      await Names.collection.dropIndex(i.name);
      console.log(`✅ Dropped index: ${i.name}`);
    }
  }

  // Step 2: Remove old fields using raw MongoDB driver
  const result = await Names.collection.updateMany(
    {},
    { $unset: { likedby: [] } },
  );

  console.log(`✅ Removed old fields from ${result.modifiedCount} documents.`);

  // Step 3: Verify
  const check = await Names.collection.findOne({
    $or: [{ likedby: { $exists: true } }],
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
