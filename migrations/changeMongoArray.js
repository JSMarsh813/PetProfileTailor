import "dotenv/config";
import db from "../utils/db.js";
import Names from "@models/Names.js";

await db.connect();
console.log("✅ Connected to MongoDB");

// try {
//   // Convert 'notes' array to a single string and trim whitespace
//   const result = await Names.collection.updateMany(
//     { notes: { $exists: true, $type: "array" } },
//     [
//       {
//         $set: {
//           notes: {
//             $trim: {
//               input: {
//                 $reduce: {
//                   input: "$notes",
//                   initialValue: "",
//                   in: { $concat: ["$$value", " ", "$$this"] },
//                 },
//               },
//             },
//           },
//         },
//       },
//     ],
//   );

//   console.log(
//     `✅ Converted 'notes' array to string in ${result.modifiedCount} documents.`,
//   );

//   // Verify a sample document
//   const sample = await Names.collection.findOne({});
//   console.log("🔎 Sample document:", sample);
// } catch (err) {
//   console.error("❌ Migration failed:", err);
// }

await db.disconnect();
console.log("✅ Disconnected from MongoDB");
