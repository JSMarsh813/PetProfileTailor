import User from "@models/User";
import db from "@utils/db";
const cloudinary = require("cloudinary").v2;
import { getSessionForApis } from "@/utils/api/getSessionForApis";

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const session = await getSessionForApis({
    req,
    res,
  });
  if (!session) return null;

  //session info
  const userId = session.user.id;

  // no req is appearing in console...

  const newProfileImage = req.body.newProfileImage;

  await db.connect();
  const toUpdateUser = await User.findById(userId);
  toUpdateUser.profileimage = newProfileImage;

  await toUpdateUser.save();

  res.send({
    message: "Profile Image updated",
  });
}

export default handler;
