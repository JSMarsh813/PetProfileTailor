import { NextResponse } from "next/server";
import mongoose from "mongoose";
import db from "@/utils/db";
import Report from "@/models/Report";
import { leanWithStrings } from "@/utils/mongoDataCleanup";

import { getServerSession } from "next-auth";
import { serverAuthOptions } from "@/lib/auth";

export async function GET() {
  try {
    // 🔑 Verify user session
    const session = await getServerSession(serverAuthOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    // ✅ Connect to Mongo (use singleton inside db.connect for best performance)
    await db.connect();

    // ✅ Run both queries in parallel
    const [nameReports, descriptionReports] = await Promise.all([
      leanWithStrings(
        Report.find(
          {
            reportedBy: userId,
            status: { $nin: ["dismissed", "deleted", "resolved"] },
            contentType: "names",
          },
          { contentId: 1, status: 1, _id: 1 },
        ),
      ),
      leanWithStrings(
        Report.find(
          {
            reportedBy: userId,
            status: "pending", // only get pending reports
            contentType: "descriptions",
          },
          { contentId: 1, status: 1, _id: 0 },
        ),
      ),
    ]);

    return NextResponse.json({
      names: nameReports,
      descriptions: descriptionReports,
    });
  } catch (err) {
    console.error("Error fetching reports:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
