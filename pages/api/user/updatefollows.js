import { getSession } from "next-auth/react";

import User from "../../../models/User";
import db from "../../../utils/db";
const mongoose = require("mongoose");

async function handler(req, res) {
  // console.log(`this is request body ${(JSON.stringify(req))}`)
  //nothing appearing ...
  if (req.method !== "PUT") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: "signin required" });
  }

  //session info
  const { user } = session;

  // the things we're sending to update. In this case, we're sending the descriptions id in the request and then writing the logic later to determine what to change the current array to.
  const userToFollowId = req.body.currentTargetedId; //!!!!
  console.log(req.body);

  console.log(`this is userToFollowId  ${userToFollowId}`);

  let idToObjectId = mongoose.Types.ObjectId(userToFollowId);
  console.log(idToObjectId);

  await db.connect();

  // use the model we're updating,IndividualNames. Look through it to find the one document we're looking for with the Description's id.
  const toUpdateUserFollowers = await User.findById(idToObjectId);

  console.log(`this is toupdatedescription ${toUpdateUserFollowers}`);

  console.log(`this is user._id ${user._id}`);
  //result: this is user._id 63a90c2e83e6366b179ffc40

  // now that we have the right Description, lets check if it has the current user's id inside of it
  //if true, lets filter the user out
  //  if false, lets add the user to the Description object's likedby property

  toUpdateUserFollowers.followers.includes(user._id)
    ? (toUpdateUserFollowers.followers = toUpdateUserFollowers.followers.filter(
        (userinfollowers) => userinfollowers != user._id
      ))
    : (toUpdateUserFollowers.followers = toUpdateUserFollowers.followers.concat(
        user._id
      ));

  await toUpdateUserFollowers.save();
  await db.disconnect();
  res.send({
    message: "followers updated",
  });
}

export default handler;
