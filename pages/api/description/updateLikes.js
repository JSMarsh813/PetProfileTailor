import Description from "../../../models/description";
import db from "../../../utils/db";
const mongoose = require("mongoose");

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const user = req.body.signedInUsersId;

  const descriptionId = req.body.currentTargetedId;

  let idToObjectId = mongoose.Types.ObjectId(descriptionId);

  await db.connect();

  const toUpdateDescription = await Description.findById(idToObjectId);

  // now that we have the right Description, lets check if it has the current user's id inside of it
  //if true, lets filter the user out
  //  if false, lets add the user to the Description object's likedby property

  toUpdateDescription.likedby.includes(user._id)
    ? (toUpdateDescription.likedby = toUpdateDescription.likedby.filter(
        (userinlikedby) => userinlikedby != user._id,
      ))
    : (toUpdateDescription.likedby = toUpdateDescription.likedby.concat(
        user._id,
      ));

  await toUpdateDescription.save();

  res.send({
    message: "Descriptions likes updated",
  });
}

export default handler;
