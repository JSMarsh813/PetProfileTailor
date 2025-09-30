import User from "@models/User";
import db from "@utils/db";
import mongoose from "mongoose";
import { getSessionForApis } from "@/utils/api/getSessionForApis";

export async function PUT(req) {
  await db.connect();

  const { ok, session } = await getSessionForApis({ req });
  if (!ok) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), {
      status: 401,
    });
  }

  const userId = session.user.id;
  const body = await req.json();
  const { userToFollowId, userFollowed } = body;

  const toUpdateUserFollowers = await User.findById(
    mongoose.Types.ObjectId(userToFollowId),
  );

  if (!toUpdateUserFollowers) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });
  }

  // Add or remove the current user from followers
  if (userFollowed) {
    toUpdateUserFollowers.followers = toUpdateUserFollowers.followers.filter(
      (followerId) => followerId.toString() !== userId,
    );
  } else {
    toUpdateUserFollowers.followers =
      toUpdateUserFollowers.followers.concat(userId);
  }

  await toUpdateUserFollowers.save();

  return new Response(JSON.stringify({ message: "Followers updated" }), {
    status: 200,
  });
}

// import User from "@models/User";
// import db from "@utils/db";
// const mongoose = require("mongoose");
// import { getSessionForApis } from "@/utils/api/getSessionForApis";

// async function handler(req, res) {
//   if (req.method !== "PUT") {
//     return res.status(400).send({ message: `${req.method} not supported` });
//   }

//   const { ok, session } = await getSessionForApis({
//     req,
//     res,
//   });
//   if (!ok) {
//     return;
//   }
//   const userId = session.user.id;

//   const { userToFollowId, userFollowed } = req.body;
//   let idToObjectId = mongoose.Types.ObjectId(userToFollowId);

//   await db.connect();

//   // use the model we're updating,IndividualNames. Look through it to find the one document we're looking for with the Description's id.
//   const toUpdateUserFollowers = await User.findById(idToObjectId);

//   //result: this is user._id 63a90c2e83e6366b179ffc40

//   // now that we have the right Description, lets check if it has the current user's id inside of it
//   //if true, lets filter the user out
//   //  if false, lets add the user to the Description object's likedby property

//   let clickingUserObjectId = mongoose.Types.ObjectId(userId);

//   userFollowed
//     ? (toUpdateUserFollowers.followers = toUpdateUserFollowers.followers.filter(
//         (userinfollowers) => userinfollowers != userId,
//       ))
//     : (toUpdateUserFollowers.followers =
//         toUpdateUserFollowers.followers.concat(userId));

//   await toUpdateUserFollowers.save();

//   res.send({
//     message: "followers updated",
//   });
// }

// export default handler;
