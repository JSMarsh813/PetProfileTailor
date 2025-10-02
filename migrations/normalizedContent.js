import "dotenv/config";
import db from "../utils/db.js";
import Name from "../models/Name.js";
import normalizeString from "../utils/stringManipulation/normalizeString.js";

await db.connect();
console.log("✅ Connected to MongoDB");

try {
  // Fetch all documents
  const cursor = Name.find().cursor();
  let count = 0;

  for await (const doc of cursor) {
    const updates = {};
    if (doc.content)
      updates.normalizedContent = normalizeString(doc.content).slice(0, 120);

    if (Object.keys(updates).length > 0) {
      await Name.updateOne({ _id: doc._id }, { $set: updates });
      count++;
    }
  }

  console.log(`✅ Normalized fields updated in ${count} documents.`);

  // Optional: verify a sample
  const sample = await Name.findOne({});
  console.log("🔎 Sample document:", sample);
} catch (err) {
  console.error("❌ Migration failed:", err);
}

await db.disconnect();
console.log("✅ Disconnected from MongoDB");
