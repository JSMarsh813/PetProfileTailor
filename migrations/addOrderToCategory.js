import "dotenv/config";
import db from "../utils/db.js";
import NameCategory from "../models/nameCategory.js";

(async () => {
  await db.connect();

  // Find all categories, assign an order based on their index
  const categories = await NameCategory.find().sort({ category: 1 });

  for (let i = 0; i < categories.length; i++) {
    categories[i].order = i;
    await categories[i].save();
  }

  console.log("Backfill complete ✅");
  process.exit(0);
})();
