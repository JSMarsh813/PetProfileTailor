import "dotenv/config";
import db from "../utils/db.js";
import Names from "../models/Name.js";

await db.connect();
console.log("✅ Connected to MongoDB");

try {
  // Step 1: Drop any old indexes on flaggedby
  const indexes = await Names.collection.indexes();
  for (const i of indexes) {
    if (i.key.flaggedby) {
      await Names.collection.dropIndex(i.name);
      console.log(`✅ Dropped index: ${i.name}`);
    }
  }

  // Step 2: Remove the flaggedby field using $unset
  const result = await Names.collection.updateMany(
    {},
    { $unset: { flaggedby: "" } },
  );

  console.log(`✅ Removed flaggedby from ${result.modifiedCount} documents.`);

  // Step 3: Verify removal
  const check = await Names.collection.findOne({
    flaggedby: { $exists: true },
  });

  if (!check) {
    console.log("✅ All flaggedby fields successfully removed.");
  } else {
    console.log("⚠️ Some documents still have flaggedby:", check);
  }
} catch (err) {
  console.error("❌ Migration failed:", err);
}

await db.disconnect();
console.log("✅ Disconnected from MongoDB");
