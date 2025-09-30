import "dotenv/config";
import db from "../utils/db.js";
import Names from "../models/Name.js";

await db.connect();
console.log("✅ Connected to MongoDB");

try {
  await Names.collection.dropIndex("name_1");
  // Step 1: Rename 'name' → 'content'
  const renameNameResult = await Names.collection.updateMany(
    { name: { $exists: true }, content: { $exists: false } }, // only if 'content' doesn't exist yet
    [{ $set: { content: "$name" } }, { $unset: "name" }],
  );

  console.log(
    `✅ Renamed 'name' to 'content' in ${renameNameResult.modifiedCount} documents.`,
  );

  // Step 2: Rename 'description' → 'notes'
  const renameDescResult = await Names.collection.updateMany(
    { description: { $exists: true }, notes: { $exists: false } }, // only if 'notes' doesn't exist yet
    [{ $set: { notes: "$description" } }, { $unset: "description" }],
  );

  console.log(
    `✅ Renamed 'description' to 'notes' in ${renameDescResult.modifiedCount} documents.`,
  );

  // Step 3: Verify a sample document
  const sample = await Names.collection.findOne({});
  console.log("🔎 Sample document:", sample);
} catch (err) {
  console.error("❌ Migration failed:", err);
}

await db.disconnect();
console.log("✅ Disconnected from MongoDB");
