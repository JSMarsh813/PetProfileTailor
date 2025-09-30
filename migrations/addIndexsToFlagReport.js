import "dotenv/config";
import mongoose from "mongoose";
import dbConnect from "../utils/db.js";

const createReportIndexes = async () => {
  await dbConnect.connect();

  const reportsCollection = mongoose.connection.collection("reports");

  const indexesToCreate = [
    { key: { contentType: 1 }, name: "contentType_index" },
    { key: { contentId: 1 }, name: "contentId_index" },
    { key: { contentCreatedBy: 1 }, name: "contentCreatedBy_index" },
    { key: { reportedByUser: 1 }, name: "reportedByUser_index" },
    { key: { status: 1 }, name: "status_index" },
    { key: { outcome: 1 }, name: "outcome_index" },
    { key: { priority: 1 }, name: "priority_index" },
    { key: { status: 1, priority: -1 }, name: "status_priority_index" },
    {
      key: { contentType: 1, status: 1, createdAt: -1 },
      name: "contentType_status_createdAt_index",
    },

    // Partial indexes
    {
      key: { status: 1 },
      name: "status_name_index",
      partialFilterExpression: { contentType: "names" },
    },
    {
      key: { status: 1 },
      name: "status_description_index",
      partialFilterExpression: { contentType: "descriptions" },
    },
    {
      key: { status: 1 },
      name: "status_user_index",
      partialFilterExpression: { contentType: "users" },
    },
  ];

  try {
    const existingIndexes = await reportsCollection.indexes();
    const existingIndexNames = existingIndexes.map((idx) => idx.name);

    for (const index of indexesToCreate) {
      if (!existingIndexNames.includes(index.name)) {
        const options = { name: index.name };
        if (index.partialFilterExpression) {
          options.partialFilterExpression = index.partialFilterExpression;
        }

        await reportsCollection.createIndex(index.key, options);
        console.log(`✅ Created index: ${index.name}`);
      } else {
        console.log(`ℹ️ Index already exists: ${index.name}`);
      }
    }

    console.log("🎉 All Report indexes processed successfully!");
  } catch (err) {
    console.error("❌ Error creating Report indexes:", err);
  } finally {
    await mongoose.connection.close();
  }
};

createReportIndexes();

//node migrations/addIndexsToReport.js
