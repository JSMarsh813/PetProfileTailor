import db from "../../../../utils/db";
import FlagReport from "@/models/FlagReport";

import { getCurrentUserId } from "@/utils/auth"; // replace with your auth logic

export async function GET(req) {
  try {
    // Connect to Mongo
    const userId = req.body.contentid;
    await db.connect();

    // Get current user ID from session / JWT / etc.
    // const currentUserId = await getCurrentUserId(req);
    // if (!currentUserId) {
    //   return new Response(JSON.stringify({ error: "Unauthorized" }), {
    //     status: 401,
    //   });
    // }

    //  Query FlagReport for all reports by this user
    const reports = await FlagReport.find(
      { reportedbyuser: userId },
      { contentid: 1, _id: 0 }, // only return contentid
    ).lean(); //.lean() makes the query faster by returning plain JS objects.

    // 4 Extract contentIds into a simple array
    const contentIds = reports.map((r) => r.contentid);

    return new Response(JSON.stringify({ contentIds }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
