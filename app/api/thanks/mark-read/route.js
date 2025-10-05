import dbConnect from "@utils/db";
import Thank from "@/models/Thank";
import { NextResponse } from "next/server";
import { getSessionForApis } from "@/utils/api/getSessionForApis";

export async function PATCH() {
  // partial update
  // just updating an existing field, not creating anything
  // so this is a PATCH instead of a PUT
  const { ok, session } = await getSessionForApis({ req });
  if (!ok || !session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;
  await dbConnect.connect();

  await Thank.updateMany(
    { contentCreator: userId, read: false },
    { $set: { read: true } },
  );

  return NextResponse.json({ success: true });
}
