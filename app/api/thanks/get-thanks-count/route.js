import Thank from "@/models/Thank";
import { getServerSession } from "next-auth";

export async function GET(req) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ count: 0 }), { status: 200 });
  }

  const userId = session.user.id;

  // Query unread count directly
  const count = await Thank.countDocuments({
    contentCreator: userId,
    read: false,
  });

  return new Response(JSON.stringify({ count }), { status: 200 });
}
