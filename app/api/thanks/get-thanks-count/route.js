import Thank from "@/models/Thank";
import { getSessionForApis } from "@/utils/api/getSessionForApis";

export async function GET(req) {
  const { ok, session } = await getSessionForApis({ req });
  if (!ok) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;
  console.log("this is userId in get thanks count", userId);

  if (!userId)
    return new Response(JSON.stringify({ error: "userId required" }), {
      status: 400,
    });

  // Query unread count directly
  const count = await Thank.countDocuments({
    contentCreator: userId,
    read: false,
  });

  return new Response(JSON.stringify({ count }), { status: 200 });
}
