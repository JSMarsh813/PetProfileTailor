import "dotenv/config";
import mongoose from "mongoose";
import dbConnect from "../utils/db.js";

const createReportIndexes = async () => {
  await dbConnect.connect();

  const reportsCollection = mongoose.connection.collection("reports");

  const indexesToCreate = [
    { key: { contenttype: 1 }, name: "contenttype_index" },
    { key: { contentid: 1 }, name: "contentid_index" },
    { key: { contentcreatedby: 1 }, name: "contentcreatedby_index" },
    { key: { reportedbyuser: 1 }, name: "reportedbyuser_index" },
    { key: { status: 1 }, name: "status_index" },
    { key: { outcome: 1 }, name: "outcome_index" },
    { key: { priority: 1 }, name: "priority_index" },
    { key: { status: 1, priority: -1 }, name: "status_priority_index" },
    {
      key: { contenttype: 1, status: 1, createdAt: -1 },
      name: "contenttype_status_createdAt_index",
    },

    // Partial indexes
    {
      key: { status: 1 },
      name: "status_name_index",
      partialFilterExpression: { contenttype: "names" },
    },
    {
      key: { status: 1 },
      name: "status_description_index",
      partialFilterExpression: { contenttype: "descriptions" },
    },
    {
      key: { status: 1 },
      name: "status_user_index",
      partialFilterExpression: { contenttype: "users" },
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
