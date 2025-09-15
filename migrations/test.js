import "dotenv/config";
import db from "../utils/db.js";
import Names from "../models/Names.js";

await db.connect();
console.log("✅ Connected to MongoDB");

try {
  // Step 1: Find duplicates
  const duplicates = await Names.aggregate([
    {
      $group: { _id: "$content", count: { $sum: 1 }, docs: { $push: "$_id" } },
    },
    { $match: { count: { $gt: 1 } } },
  ]);

  if (duplicates.length > 0) {
    console.log(`⚠ Found ${duplicates.length} duplicate content values.`);
    duplicates.forEach((dup) => {
      console.log("Duplicate content:", dup._id, "Document IDs:", dup.docs);
    });

    // Optional: Remove duplicates, keeping the first
    for (const dup of duplicates) {
      const [keep, ...remove] = dup.docs;
      await Names.deleteMany({ _id: { $in: remove } });
      console.log(
        `🗑 Removed ${remove.length} duplicates for content "${dup._id}"`,
      );
    }
  } else {
    console.log("✅ No duplicates found.");
  }

  // Step 2: Drop the old index
  const indexes = await Names.collection.indexes();
  const contentIndex = indexes.find((idx) => idx.key.content === 1);

  if (contentIndex) {
    console.log("Dropping old index:", contentIndex.name);
    await Names.collection.dropIndex(contentIndex.name);
  } else {
    console.log("No existing content index found.");
  }

  // Step 3: Recreate unique index
  await Names.collection.createIndex(
    { content: 1 },
    { unique: true, sparse: true },
  );
  console.log("✅ Unique index on 'content' created successfully.");
} catch (err) {
  console.error("❌ Migration failed:", err);
}

await db.disconnect();
console.log("✅ Disconnected from MongoDB");
