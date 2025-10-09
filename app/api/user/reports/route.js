import { NextResponse } from "next/server";
import mongoose from "mongoose";
import db from "@/utils/db";
import Report from "@/models/Report";
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
            status: "pending",
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
