import IndividualPosts from "../../../models/Post";
import db from "../../../utils/db";
const mongoose = require("mongoose");

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const postId = req.body.currentTargetedId;
  const userId = req.body.signedInUsersId;

  await db.connect();

  //result: new ObjectId("63b7fe4362bf243a197c505d")
  // let idToObjectId = mongoose.Types.ObjectId(postId);
  // change the string id into an objectId, so it can be compared to the name's object id in the MongoDB database.
  //  CHANGE TO MONGODB ID  https://stackoverflow.com/questions/56592063/how-to-convert-a-string-to-a-mongodb-objectid

  // "63ae16a9f202c8bf57525455", is stored in nameId
  //Object { currentTargetedNameId: "63ae16a9f202c8bf57525455" }

  const toUpdatePost = await IndividualPosts.findById(postId);

  toUpdatePost.likedby.includes(userId)
    ? (toUpdatePost.likedby = toUpdatePost.likedby.filter(
        (userinlikedby) => userinlikedby != userId,
      ))
    : (toUpdatePost.likedby = toUpdatePost.likedby.concat(userId));

  await toUpdatePost.save();

  res.send({
    message: "Names likes updated",
  });

  //if statement
}

export default handler;
