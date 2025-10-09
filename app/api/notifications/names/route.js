import mongoose from "mongoose";
import db from "@utils/db";
// necessary for populate
import Name from "@/models/Name";
import User from "@/models/User";
import NameLike from "@/models/NameLike";
import { getSessionForApis } from "@/utils/api/getSessionForApis";
import { getPaginatedNotifications } from "@/utils/api/getPaginatedNotifications";

export const GET = async (req) => {
  try {
    const { ok, session, response } = await getSessionForApis({ req });
    if (!ok) return response;

    const userId = new mongoose.Types.ObjectId(session.user.id);
    // was failing with $ne: userId
    // found out ne doesn't automatically cast the type to objectId

    // Mongoose knows contentCreator is an ObjectId field, so it automatically casts userId (even if it’s a string) into an ObjectId for you.
    // query operators like $ne, $in, $nin, $gte, etc., Mongoose can’t always infer the expected type cleanly
    // So it skips automatic casting for safety — you have to pass an ObjectId yourself.

    await db.connect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || 1);
    const limit = parseInt(searchParams.get("limit") || 25);

    const thankNotifs = await getPaginatedNotifications(
      NameLike,
      {
        contentCreator: userId,
        likedBy: { $ne: userId },
      },
      [
        { path: "likedBy", select: ["profileName", "profileImage", "name"] },
        { path: "contentId", select: ["content", "createdBy", "tags"] },
      ],
      { page, limit },
    );

    return new Response(JSON.stringify(thankNotifs), { status: 200 });
  } catch (err) {
    console.error("Error fetching name likes notifications:", err);
    return new Response("Failed to fetch name likes notifications", {
      status: 500,
    });
  }
};
