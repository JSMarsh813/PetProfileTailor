import "dotenv/config";
import db from "../utils/db.js";
import Descriptions from "../models/Description.js";
import normalizeString from "../utils/api/normalizeString.js";

await db.connect();
console.log("✅ Connected to MongoDB");

try {
  // Fetch all documents
  const cursor = Descriptions.find().cursor();
  let count = 0;

  for await (const doc of cursor) {
    const updates = {};
    if (doc.content)
      updates.normalizedContent = normalizeString(doc.content).slice(0, 120);

    if (Object.keys(updates).length > 0) {
      await Descriptions.updateOne({ _id: doc._id }, { $set: updates });
      count++;
    }
  }

  console.log(`✅ Normalized fields updated in ${count} documents.`);

  // Optional: verify a sample
  const sample = await Descriptions.findOne({});
  console.log("🔎 Sample document:", sample);
} catch (err) {
  console.error("❌ Migration failed:", err);
}

await db.disconnect();
console.log("✅ Disconnected from MongoDB");
