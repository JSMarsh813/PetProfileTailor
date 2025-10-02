import { NextResponse } from "next/server";
import db from "@/utils/db";
import NameCategory from "@/models/NameCategory";
import DescriptionCategory from "@/models/DescriptionCategory";
import { leanWithStrings } from "@/utils/mongoDataCleanup";

// ✅ Control revalidation (cache TTL in seconds)
// export const revalidate = 10800; // cache for 3 hours

export async function GET() {
  try {
    await db.connect(); // make sure db.connect uses a global connection

    const [nameCategories, descCategories] = await Promise.all([
      leanWithStrings(NameCategory.find().populate("tags").sort({ order: 1 })),
      leanWithStrings(
        DescriptionCategory.find().populate("tags").sort({ order: 1 }),
      ),
    ]);

    return NextResponse.json({
      names: nameCategories,
      descriptions: descCategories,
    });
  } catch (err) {
    console.error("Error fetching categories:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
