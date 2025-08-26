import "dotenv/config";
import db from "../utils/db.js";
import Names from "../models/Names.js";

await db.connect();
console.log("Connected to MongoDB");

// Step 1: Update likedByLength using aggregation in update
try {
  const result = await Names.updateMany({}, [
    {
      $set: {
        likedbylength: {
          $cond: [{ $isArray: "$likedby" }, { $size: "$likedby" }, 0],
        },
      },
    },
  ]);

  console.log(`Updated ${result.modifiedCount} documents.`);
} catch (err) {
  console.error("Update failed:", err);
}

// Step 2: Create index
try {
  await Names.collection.createIndex({ likedbylength: -1 });
  console.log("Index on likedByLength created successfully.");
} catch (err) {
  console.error("Failed to create index:", err);
}

await db.disconnect();
console.log("Disconnected");

//MongoInvalidArgumentError: Update document requires atomic operators
// this error wad due to likedbylength field is defined as required in the schema, while likedBy is not even required, which likedbylength requires
