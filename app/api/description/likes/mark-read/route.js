import dbConnect from "@utils/db";
import DescriptionLike from "@/models/DescriptionLike";
import { NextResponse } from "next/server";
import { getSessionForApis } from "@/utils/api/getSessionForApis";

export async function PATCH(req) {
  const { ok, session } = await getSessionForApis({ req });
  if (!ok || !session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;
  await dbConnect.connect();

  await DescriptionLike.updateMany(
    { contentCreator: userId, read: false },
    { $set: { read: true } },
  );

  return NextResponse.json({ success: true });
}
