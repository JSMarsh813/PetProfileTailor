import User from "../../../models/User";
import db from "../../../utils/db";
const cloudinary = require("cloudinary").v2;

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  //session info
  const user = req.body.user;

  console.log(req.body);

  // no req is appearing in console...

  const { newProfileImage } = req.body.newProfileImage;

  await db.connect();
  const toUpdateUser = await User.findById(user);
  toUpdateUser.profileimage = newProfileImage;

  await toUpdateUser.save();

  res.send({
    message: "Profile Image updated",
  });
}

export default handler;
