// app/api/descriptions/[id]/like/route.js
import dbConnect from "@/utils/db";
import mongoose from "mongoose";
import DescriptionLikes from "@/models/DescriptionLike";
import Description from "@/models/Description";
import { getSessionForApis } from "@/utils/api/getSessionForApis";

export async function POST(req, { params }) {
  await dbConnect.connect();

  const { contentId } = await params;
  const body = await req.json();
  const { contentCreator } = body;

  const { ok, session: serverSession } = await getSessionForApis();
  if (!ok) {
    return new Response("Unauthorized", { status: 401 });
  }

  const likedBy = serverSession.user.id;
  if (!likedBy) {
    return Response.json({ error: "userId required" }, { status: 400 });
  }

  const session = await mongoose.startSession();
  // console.log("toggle like api ran", { userId, descriptionId });

  try {
    session.startTransaction();
    // transaction to ensure likes count stay in sync, if both the collections aren't updated then cancel
    const existingLike = await DescriptionLikes.findOne({
      likedBy,
      contentId,
    }).session(session);

    let liked = false;

    if (existingLike) {
      // Unlike, delete the document, decrement likedByCount
      await DescriptionLikes.deleteOne({ _id: existingLike._id }).session(
        session,
      );
      await Description.updateOne(
        { _id: contentId },
        { $inc: { likedByCount: -1 } },
        { session },
      );
      liked = false;
    } else {
      // Like, insert the document, increment likedByCount
      const likingOwnContent = likedBy === contentCreator;
      await DescriptionLikes.create(
        [{ likedBy, contentCreator, contentId, read: likingOwnContent }],
        { session },
      );
      await Description.updateOne(
        { _id: contentId },
        { $inc: { likedByCount: 1 } },
        { session },
      );
      liked = true;
    }

    await session.commitTransaction();
    return Response.json({ liked });
  } catch (err) {
    await session.abortTransaction();
    return Response.json({ error: err.message }, { status: 500 });
  } finally {
    session.endSession();
  }
}

export function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
