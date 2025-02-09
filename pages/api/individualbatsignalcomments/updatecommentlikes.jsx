import IndividualComments from "../../../models/BatSignalComment";
import db from "../../../utils/db";
const mongoose = require("mongoose");

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const commentId = req.body.currentTargetedId;
  const userId = req.body.signedInUsersId;

  await db.connect();

  const toUpdateComment = await IndividualComments.findById(commentId);

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

  toUpdateComment.likedby.includes(userId)
    ? (toUpdateComment.likedby = toUpdateComment.likedby.filter(
        (userinlikedby) => userinlikedby != userId,
      ))
    : (toUpdateComment.likedby = toUpdateComment.likedby.concat(userId));

  await toUpdateComment.save();

  res.send({
    message: "Comments likes updated",
  });

  //if statement
}

export default handler;
