import { NextResponse } from "next/server";
import mongoose from "mongoose";
import db from "@/utils/db";
import NameLikes from "@/models/NameLike";
import DescriptionLikes from "@/models/DescriptionLike";
import { leanWithStrings } from "@/utils/mongoDataCleanup";

import { getServerSession } from "next-auth";
import { serverAuthOptions } from "@/lib/auth";
export async function GET() {
  try {
    // 🔑 Get the current user session
    const session = await getServerSession(serverAuthOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const likedBy = new mongoose.Types.ObjectId(session.user.id);

    await db.connect();

    // Run the queries in parallel
    const [nameLikes, descriptionLikes] = await Promise.all([
      leanWithStrings(
        NameLikes.find({ likedBy }, { contentId: 1, _id: 1 }),
      ).then((docs) =>
        docs.map((d) => ({ id: d._id, contentId: d.contentId })),
      ),
      leanWithStrings(
        DescriptionLikes.find({ likedBy }, { contentId: 1, _id: 1 }),
      ).then((docs) =>
        docs.map((d) => ({ id: d._id, contentId: d.contentId })),
      ),
    ]);

    return NextResponse.json({
      names: nameLikes,
      descriptions: descriptionLikes,
    });
  } catch (err) {
    console.error("Error fetching likes:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
