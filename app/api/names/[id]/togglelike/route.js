import dbConnect from "@/utils/db";
import mongoose from "mongoose";
import NameLikes from "@/models/NameLike";
import Names from "@/models/Name";
import { getSessionForApis } from "@/utils/api/getSessionForApis";

export async function POST(req, { params }) {
  await dbConnect.connect();

  const { id } = await params;

  const body = await req.json();
  const { createdBy } = body;

  const { ok, session } = await getSessionForApis({ req });
  if (!ok) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  if (!userId)
    return new Response(JSON.stringify({ error: "userId required" }), {
      status: 400,
    });

  const dbSession = await mongoose.startSession();

  try {
    dbSession.startTransaction();
    // transaction to ensure likes count stay in sync, if both the collections aren't updated then cancel

    const existingLike = await NameLikes.findOne({ userId, id }).session(
      dbSession,
    );

    let liked = false;

    if (existingLike) {
      // Unlike, delete the document, decrement likedByCount
      await NameLikes.deleteOne({ _id: existingLike._id }).session(dbSession);
      await Names.updateOne(
        { _id: id },
        { $inc: { likedByCount: -1 } },
        { session: dbSession },
      );
      liked = false;
    } else {
      // Like, insert the document, increment likedByCount
      const likingOwnContent = userId === createdBy;
      await NameLikes.create([{ userId, id, read: likingOwnContent }], {
        session: dbSession,
      });
      await Names.updateOne(
        { _id: id },
        { $inc: { likedByCount: 1 } },
        { session: dbSession },
      );
      liked = true;
    }

    await dbSession.commitTransaction();

    return new Response(JSON.stringify({ liked }), { status: 200 });
  } catch (err) {
    await dbSession.abortTransaction();
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  } finally {
    dbSession.endSession();
  }
}

// import dbConnect from "@/utils/db";
// import mongoose from "mongoose";
// import NameLikes from "@/models/NameLike";
// import Names from "@/models/Name";
// import { getSessionForApis } from "@/utils/api/getSessionForApis";

// export default async function handler(req, res) {
//   await dbConnect.connect();
//   const { id: nameId } = req.query;
//   const { createdBy } = req.body;

//   const { ok, session: serverSession } = await getSessionForApis({
//     req,
//     res,
//   });
//   if (!ok) {
//     return;
//   }

//   const userId = serverSession.user.id;

//   console.log("req.query", req.query);

//   if (!userId) return res.status(400).json({ error: "userId required" });
//   if (req.method !== "POST") return res.status(405).end();

//   const session = await mongoose.startSession();
//   console.log("toggle like api ran");
//   console.log("userId", userId);
//   console.log("userId", userId, "nameId", nameId);

//   try {
//     session.startTransaction();
//     // transaction to ensure likes count stay in sync, if both the collections aren't updated then cancel

//     const existingLike = await NameLikes.findOne({ userId, nameId }).session(
//       session,
//     );

//     let liked = false;

//     if (existingLike) {
//       // Unlike, delete the document, decrement likedByCount
//       await NameLikes.deleteOne({ _id: existingLike._id }).session(session);
//       await Names.updateOne(
//         { _id: nameId },
//         { $inc: { likedByCount: -1 } },
//         { session },
//       );
//       liked = false;

//       res.status(200).json({ liked });
//     } else {
//       const likingOwnContent = sessionUserId === createdBy;
//       // Like, insert the document, increment likedByCount
//       await NameLikes.create([{ userId, nameId, read: likingOwnContent }], {
//         session,
//       });
//       await Names.updateOne(
//         { _id: nameId },
//         { $inc: { likedByCount: 1 } },
//         { session },
//       );
//       liked = true;

//       res.status(200).json({ liked });
//     }

//     await session.commitTransaction();
//   } catch (err) {
//     await session.abortTransaction();
//     res.status(500).json({ error: err.message });
//   } finally {
//     session.endSession();
//   }
// }
