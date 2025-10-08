import db from "@utils/db";
import Thank from "@/models/Thank";
import { getSessionForApis } from "@/utils/api/getSessionForApis";
import { getPaginatedNotifications } from "@/utils/api/getPaginatedNotifications";

export const GET = async (req) => {
  try {
    const { ok, session, response } = await getSessionForApis({ req });
    if (!ok) return response;

    const userId = session.user.id;

    console.log("nameNotifs userId", userId);

    await db.connect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || 1);
    console.log("nameNotifs page", page);
    const limit = parseInt(searchParams.get("limit") || 25);
    console.log("nameNotifs limit", limit);

    const thankNotifs = await getPaginatedNotifications(
      Thank,
      { contentCreator: userId },
      [
        { path: "thanksBy", select: ["profileName", "profileImage", "name"] },
        { path: "nameId", select: ["content", "createdBy", "tags"] },
        { path: "descriptionId", select: ["content", "createdBy"] },
      ],
      { page, limit },
    );

    return new Response(JSON.stringify(thankNotifs), { status: 200 });
  } catch (err) {
    console.error("Error fetching thanks notifications:", err);
    return new Response("Failed to fetch thanks notifications", {
      status: 500,
    });
  }
};
