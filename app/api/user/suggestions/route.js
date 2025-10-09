import { NextResponse } from "next/server";
import mongoose from "mongoose";
import db from "@/utils/db";
import Suggestion from "@/models/Suggestion";
import { leanWithStrings } from "@/utils/mongoDataCleanup";

import { getServerSession } from "next-auth";
import { serverAuthOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(serverAuthOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    await db.connect();

    const [nameSuggestions, descriptionSuggestions] = await Promise.all([
      leanWithStrings(
        Suggestion.find(
          {
            suggestionBy: userId,
            status: { $nin: ["dismissed", "deleted", "resolved"] },
            contentType: "names",
          },
          { contentId: 1, status: 1, _id: 1 },
        ),
      ),
      leanWithStrings(
        Suggestion.find(
          {
            suggestionBy: userId,
            status: "pending",
            contentType: "descriptions",
          },
          { contentId: 1, status: 1, _id: 0 },
        ),
      ),
    ]);

    return NextResponse.json({
      names: nameSuggestions,
      descriptions: descriptionSuggestions,
    });
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
