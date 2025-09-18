import User from "@models/User";
import db from "@utils/db";
const mongoose = require("mongoose");
import { getServerSession } from "next-auth/next";
import { serverAuthOptions } from "@/lib/auth";

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const session = await getServerSession(req, res, serverAuthOptions);
  if (!session) {
    res.status(401).json({ message: "Not authenticated" });
    return null;
  }

  const userId = session.user.id;

  const { userToFollowId, userFollowed } = req.body;
  let idToObjectId = mongoose.Types.ObjectId(userToFollowId);

  await db.connect();

  // use the model we're updating,IndividualNames. Look through it to find the one document we're looking for with the Description's id.
  const toUpdateUserFollowers = await User.findById(idToObjectId);

  //result: this is user._id 63a90c2e83e6366b179ffc40

  // now that we have the right Description, lets check if it has the current user's id inside of it
  //if true, lets filter the user out
  //  if false, lets add the user to the Description object's likedby property

  let clickingUserObjectId = mongoose.Types.ObjectId(userId);

  userFollowed
    ? (toUpdateUserFollowers.followers = toUpdateUserFollowers.followers.filter(
        (userinfollowers) => userinfollowers != userId,
      ))
    : (toUpdateUserFollowers.followers =
        toUpdateUserFollowers.followers.concat(userId));

  await toUpdateUserFollowers.save();

  res.send({
    message: "followers updated",
  });
}

export default handler;
