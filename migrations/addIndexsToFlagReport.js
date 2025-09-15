import "dotenv/config";
import mongoose from "mongoose";
import dbConnect from "../utils/db.js";

const createFlagReportIndexes = async () => {
  await dbConnect.connect();

  const flagReportsCollection = mongoose.connection.collection("flagreports");

  const indexesToCreate = [
    { key: { contenttype: 1 }, name: "contenttype_index" },
    { key: { contentid: 1 }, name: "contentid_index" },
    { key: { contentcreatedbyuser: 1 }, name: "contentcreatedbyuser_index" },
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
    const existingIndexes = await flagReportsCollection.indexes();
    const existingIndexNames = existingIndexes.map((idx) => idx.name);

    for (const index of indexesToCreate) {
      if (!existingIndexNames.includes(index.name)) {
        const options = { name: index.name };
        if (index.partialFilterExpression) {
          options.partialFilterExpression = index.partialFilterExpression;
        }

        await flagReportsCollection.createIndex(index.key, options);
        console.log(`✅ Created index: ${index.name}`);
      } else {
        console.log(`ℹ️ Index already exists: ${index.name}`);
      }
    }

    console.log("🎉 All FlagReport indexes processed successfully!");
  } catch (err) {
    console.error("❌ Error creating FlagReport indexes:", err);
  } finally {
    await mongoose.connection.close();
  }
};

createFlagReportIndexes();

//node migrations/addIndexsToFlagReport.js
