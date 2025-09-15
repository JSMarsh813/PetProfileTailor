import "dotenv/config";
import db from "../utils/db.js";
import Descriptions from "../models/Description.js";

await db.connect();
console.log("✅ Connected to MongoDB");

try {
  const renameResult = await Descriptions.collection.updateMany(
    { description: { $exists: true } },
    [
      {
        $set: { content: "$description" }, // copy description to content
      },
      { $unset: "description" }, // remove old description field
    ],
  );

  console.log(
    `✅ Renamed 'description' to 'content' in ${renameResult.modifiedCount} documents.`,
  );

  // Step 3: Verify a sample document
  const sample = await Descriptions.collection.findOne({});
  console.log("🔎 Sample document:", sample);
} catch (err) {
  console.error("❌ Migration failed:", err);
}

await db.disconnect();
console.log("✅ Disconnected from MongoDB");
