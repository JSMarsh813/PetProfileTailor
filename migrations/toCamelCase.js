// migrations/toCamelCase.js
import "dotenv/config";
import db from "../utils/db.js";
import Names from "../models/Names.js";
import { migrateField } from "../utils/api/migrateField.js";

(async () => {
  await db.connect();
  console.log("✅ Connected to MongoDB");

  try {
    // ----- Namess collection -----
    await migrateField(Names, "createdby", "createdBy", true);
    await migrateField(Names, "likedbycount", "likedByCount", true);
  } catch (err) {
    console.error("❌ Migration error:", err);
  } finally {
    await db.disconnect();
    console.log("✅ Disconnected from MongoDB");
  }
})();
