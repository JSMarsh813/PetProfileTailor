import IndividualComments from "../../../models/BatSignalComment";
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
  const user = req.body.session;

  // the things we're sending to update. In this case, we're sending the names id in the request and then writing the logic later to determine what to change the current array to.
  const commentId = req.body.currentTargetedId; //!!!!

  //{ currentTargetedNameId: '63abc7d5650d1659f0dd305e' }

  // this is nameId 63abc7d5650d1659f0dd305e

  let idToObjectId = mongoose.Types.ObjectId(commentId);

  //result: new ObjectId("63b7fe4362bf243a197c505d")

  // change the string id into an objectId, so it can be compared to the name's object id in the MongoDB database.
  //  CHANGE TO MONGODB ID  https://stackoverflow.com/questions/56592063/how-to-convert-a-string-to-a-mongodb-objectid

  // "63ae16a9f202c8bf57525455", is stored in nameId
  //Object { currentTargetedNameId: "63ae16a9f202c8bf57525455" }

  await db.connect();

  // use the model we're updating,IndividualNames. Look through it to find the one document we're looking for with the name's id.
  const toUpdateComment = await IndividualComments.findById(idToObjectId);

  // result: this is toupdatename {
  //   _id: new ObjectId("63abc7d5650d1659f0dd305e"),
  //   name: 'donner',
  //   description: [],
  //   tags: [ 'christmas', 'male' ],
  //   likedby: [ '63a90c2e83e6366b179ffc40', '63ac0eb87795b89caaf760fe' ],
  //   __v: 0
  // }

  //result: this is user._id 63a90c2e83e6366b179ffc40

  // now that we have the right name, lets check if it has the current user's id inside of it
  //if true, lets filter the user out
  //  if false, lets add the user to the name object's likedby property

  toUpdateComment.likedby.includes(user._id)
    ? (toUpdateComment.likedby = toUpdateComment.likedby.filter(
        (userinlikedby) => userinlikedby != user._id
      ))
    : (toUpdateComment.likedby = toUpdateComment.likedby.concat(user._id));

  await toUpdateComment.save();

  res.send({
    message: "Comments likes updated",
  });

  //if statement
}

export default handler;
