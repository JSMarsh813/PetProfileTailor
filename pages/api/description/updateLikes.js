import Description from "../../../models/description";
import db from "../../../utils/db";
const mongoose = require("mongoose");

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const descriptionId = req.body.currentTargetedId;
  const userId = req.body.signedInUsersId;

  await db.connect();
  const toUpdateDescription = await Description.findById(descriptionId);

  // now that we have the right Description, lets check if it has the current user's id inside of it
  //if true, lets filter the user out
  //  if false, lets add the user to the Description object's likedby property

  toUpdateDescription.likedby.includes(userId)
    ? (toUpdateDescription.likedby = toUpdateDescription.likedby.filter(
        (userinlikedby) => userinlikedby != userId,
      ))
    : (toUpdateDescription.likedby =
        toUpdateDescription.likedby.concat(userId));

  await toUpdateDescription.save();

  res.send({
    message: "Descriptions likes updated",
  });
}

export default handler;
