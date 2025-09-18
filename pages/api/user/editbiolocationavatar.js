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
