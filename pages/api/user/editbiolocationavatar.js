import { getSession } from "next-auth/react";

import User from "../../../models/User";
import db from "../../../utils/db";
const mongoose = require("mongoose");

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: "signin required" });
  }

  //session info
  const { user } = session;
  const { bio, location, userid } = req.body.bioSubmission;

  // the things we're sending to update. In this case, we're sending the descriptions id in the request and then writing the logic later to determine what to change the current array to.
  const profileUserId = user._id; //!!!!

  let idToObjectId = mongoose.Types.ObjectId(profileUserId);

  await db.connect();

  const toUpdateUserBioLocationAvatar = await User.findById(idToObjectId);

  toUpdateUserBioLocationAvatar.bioblurb = bio;

  toUpdateUserBioLocationAvatar.location = location;

  await toUpdateUserBioLocationAvatar.save();

  res.send({
    message: "Profile updated",
  });
}

export default handler;
