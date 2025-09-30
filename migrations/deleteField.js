import "dotenv/config";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) throw new Error("MONGODB_URI not defined");

// lowercase fields have been changed to camelcase, so we can't use the model anymore. Since to the model, those lowercase fields we're trying to delete don't exist!

(async () => {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  try {
    const collection = mongoose.connection.db.collection("users");

    const result = await collection.updateMany(
      {},
      {
        $unset: {
          resettokenexpires: "",
          passwordresettoken: "",
          profilename: "",
          bioblurb: "",
        },
      },
    );

    console.log(`✅ Removed old fields from ${result.modifiedCount} documents`);

    const sample = await collection.findOne({});
    console.log("Sample after cleanup:", sample);
  } catch (err) {
    console.error("❌ Cleanup error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  }
})();
