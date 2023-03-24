import { getSession } from "next-auth/react";
import Names from "../../../models/Names";
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

  const { user } = session;

  // the things we're sending to update. In this case, we're sending the names id in the request and then writing the logic later to determine what to change the current array to.
  const nameId = req.body.currentTargetedId;

  let idToObjectId = mongoose.Types.ObjectId(nameId);
  console.log(idToObjectId);

  await db.connect();

  const toUpdateName = await Names.findById(idToObjectId);
  console.log(toUpdateName);
  toUpdateName.likedby.includes(user._id)
    ? (toUpdateName.likedby = toUpdateName.likedby.filter(
        (userinlikedby) => userinlikedby != user._id
      ))
    : (toUpdateName.likedby = toUpdateName.likedby.concat(user._id));

  await toUpdateName.save();
  await db.disconnect();
  res.send({
    message: "Names likes updated",
  });
}

export default handler;
