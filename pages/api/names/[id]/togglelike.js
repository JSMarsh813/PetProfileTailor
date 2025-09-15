import dbConnect from "@/utils/db";
import mongoose from "mongoose";
import NameLikes from "@/models/NameLikes";
import Names from "@/models/Names";
import { idText } from "typescript";

export default async function handler(req, res) {
  await dbConnect.connect();
  const { id: nameId } = req.query;
  const { userId } = req.body;

  console.log("req.query", req.query);

  if (!userId) return res.status(400).json({ error: "userId required" });
  if (req.method !== "POST") return res.status(405).end();

  const session = await mongoose.startSession();
  console.log("toggle like api ran");
  console.log("userId", userId);
  console.log("userId", userId, "nameId", nameId);

  try {
    session.startTransaction();
    // transaction to ensure likes count stay in sync, if both the collections aren't updated then cancel

    const existingLike = await NameLikes.findOne({ userId, nameId }).session(
      session,
    );

    let liked = false;

    if (existingLike) {
      // Unlike, delete the document, decrement likedByCount
      await NameLikes.deleteOne({ _id: existingLike._id }).session(session);
      await Names.updateOne(
        { _id: nameId },
        { $inc: { likedbycount: -1 } },
        { session },
      );
      liked = false;

      // Return the deleted likeId, for if we want to use the likedIs later to specifically reference it
      res.status(200).json({ liked, likeId: existingLike._id.toString() });
    } else {
      // Like, insert the document, increment likedByCount
      await NameLikes.create([{ userId, nameId }], { session });
      await Names.updateOne(
        { _id: nameId },
        { $inc: { likedbycount: 1 } },
        { session },
      );
      liked = true;

      // Return the newly created likeId so the client, for if we want to use the likedIs later to specifically reference it
      res.status(200).json({ liked, likeId: newLike._id.toString() });
    }

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
}
