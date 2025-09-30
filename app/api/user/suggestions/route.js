import { NextResponse } from "next/server";
import mongoose from "mongoose";
import db from "@/utils/db";
import Suggestion from "@/models/Suggestion";
import { leanWithStrings } from "@/utils/mongoDataCleanup";

import { getServerSession } from "next-auth";
import { serverAuthOptions } from "@/lib/auth";

export async function GET() {
  try {
    // 🔑 Authenticate user
    const session = await getServerSession(serverAuthOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    // ✅ Connect to MongoDB (ensure db.connect uses a global singleton)
    await db.connect();

    // ✅ Fetch both name and description suggestions in parallel
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
            status: "pending", // only get pending suggestions
            contentType: "descriptions",
          },
          { contentId: 1, status: 1, _id: 0 },
        ),
      ),
    ]);

    // ✅ Return JSON response
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
