import IndividualPosts from "../../../models/Post";
import db from "../../../utils/db";
const mongoose = require("mongoose");

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  // const session = await getSession({ req });
  // if (!session) {
  //   return res.status(401).send({ message: "signin required" });
  // }

  //session info
  const user = req.body.session.user;

  // the things we're sending to update. In this case, we're sending the names id in the request and then writing the logic later to determine what to change the current array to.
  const nameId = req.body.currentTargetedId; //

  let idToObjectId = mongoose.Types.ObjectId(nameId);

  //result: new ObjectId("63b7fe4362bf243a197c505d")

  // change the string id into an objectId, so it can be compared to the name's object id in the MongoDB database.
  //  CHANGE TO MONGODB ID  https://stackoverflow.com/questions/56592063/how-to-convert-a-string-to-a-mongodb-objectid

  // "63ae16a9f202c8bf57525455", is stored in nameId
  //Object { currentTargetedNameId: "63ae16a9f202c8bf57525455" }

  await db.connect();

  // use the model we're updating,IndividualNames. Look through it to find the one document we're looking for with the name's id.
  const toUpdatePost = await IndividualPosts.findById(idToObjectId);

  toUpdatePost.likedby.includes(user._id)
    ? (toUpdatePost.likedby = toUpdatePost.likedby.filter(
        (userinlikedby) => userinlikedby != user._id,
      ))
    : (toUpdatePost.likedby = toUpdatePost.likedby.concat(user._id));

  await toUpdatePost.save();

  res.send({
    message: "Names likes updated",
  });

  //if statement
}

export default handler;
