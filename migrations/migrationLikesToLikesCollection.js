// scripts/migrateLikedBy.js
import "dotenv/config";
import db from "../utils/db.js";
import Names from "../models/Names.js";
import NameLikes from "../models/NameLikes.js";

await db.connect();

console.log("Connected to MongoDB, starting migration...");

async function migrate() {
  const names = await Names.find({});
  for (const name of names) {
    if (!name.likedby || name.likedby.length === 0) continue;

    const docs = name.likedby.map((userId) => ({
      nameId: name._id,
      userId,
    }));

    await NameLikes.insertMany(docs, { ordered: false }).catch((err) => {
      if (err.code === 11000) {
        console.warn("Duplicate entries skipped");
      } else {
        throw err;
      }
    });

    console.log(
      `Migrated ${docs.length} likes for name "${name.name}" (${name._id})`,
    );
  }

  console.log("Migration complete ✅");
  await db.disconnect();
}

migrate().catch((err) => {
  console.error("Migration failed ❌", err);
  db.disconnect();
});
