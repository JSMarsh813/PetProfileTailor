import User from "@models/User";
import db from "@utils/db";
const mongoose = require("mongoose");
import { getSessionForApis } from "@/utils/api/getSessionForApis";

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const { ok, session } = await getSessionForApis({
    req,
    res,
  });
  if (!ok) {
    return;
  }

  const userid = session.user.id;

  const { bio, location } = req.body.bioSubmission;

  let idToObjectId = mongoose.Types.ObjectId(userid);

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
