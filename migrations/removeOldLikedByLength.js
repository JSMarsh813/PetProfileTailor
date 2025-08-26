// created since the first time I accidently had the migration add likedByLength instead of likedbylength
import "dotenv/config";
import db from "../utils/db.js";
import Names from "../models/Names.js";

await db.connect();
console.log("✅ Connected to MongoDB");

try {
  // Step 1: Drop the old index
  const indexes = await Names.collection.indexes();
  const oldIndex = indexes.find((i) => i.key && i.key.likedByLength);
  if (oldIndex) {
    await Names.collection.dropIndex(oldIndex.name);
    console.log(`✅ Dropped index: ${oldIndex.name}`);
  } else {
    console.log("ℹ️ No index on likedByLength found.");
  }

  // Step 2: Remove the likedByLength field from all documents
  const result = await Names.updateMany({}, { $unset: { likedByLength: "" } });
  console.log(
    `✅ Removed likedByLength field from ${result.modifiedCount} documents.`,
  );
} catch (err) {
  console.error("❌ Failed to remove likedByLength or index:", err);
}

await db.disconnect();
console.log("✅ Disconnected from MongoDB");
