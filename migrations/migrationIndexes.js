// migrationIndexes.js
import "dotenv/config";
import mongoose from "mongoose";
import dbConnect from "../utils/db.js";

const createIndexes = async () => {
  await dbConnect.connect();

  const namesCollection = mongoose.connection.collection("names");

  try {
    // Index for multi-tag filtering
    await namesCollection.createIndex({ tags: 1 });
    console.log("tags index created");

    // Compound index: Filter by tags, sort newest first
    await namesCollection.createIndex({ tags: 1, createdAt: -1 });
    console.log("tags + createdAt compound index created");

    //  Compound index: Filter by tags, sort oldest first
    await namesCollection.createIndex({ tags: 1, createdAt: 1 });
    console.log("tags + createdAt ascending compound index created");

    // Compound index: Filter by tags, sort most liked first
    await namesCollection.createIndex({ tags: 1, likedbylength: -1 });
    console.log("tags + likedbylength compound index created");

    // Compound index: Filter by tags, sort least liked first
    await namesCollection.createIndex({ tags: 1, likedbylength: 1 });
    console.log("tags + likedbylength compound index created");

    // Index for filtering/sorting by createdBy
    await namesCollection.createIndex({ createdby: 1 });
    console.log("createdby index created");

    console.log("All indexes created successfully!");
  } catch (err) {
    console.error("Error creating indexes:", err);
  } finally {
    mongoose.connection.close();
  }
};

createIndexes();
