import { getSession } from "next-auth/react";
import IndividualPosts from "../../../models/posts";
import db from "../../../utils/db";
const mongoose = require("mongoose");

async function handler(req, res) {
  // console.log(`this is request body ${(JSON.stringify(req))}`)
  //nothing appearing ...
  if (req.method !== "PUT") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: "signin required" });
  }

  //session info
  const { user } = session;

  // the things we're sending to update. In this case, we're sending the names id in the request and then writing the logic later to determine what to change the current array to.
  const nameId = req.body.currentTargetedId; //!!!!
  console.log(req.body);
  //{ currentTargetedNameId: '63abc7d5650d1659f0dd305e' }

  console.log(`this is nameId ${nameId}`);
  // this is nameId 63abc7d5650d1659f0dd305e

  let idToObjectId = mongoose.Types.ObjectId(nameId);
  console.log(idToObjectId);
  //result: new ObjectId("63b7fe4362bf243a197c505d")

  // change the string id into an objectId, so it can be compared to the name's object id in the MongoDB database.
  //  CHANGE TO MONGODB ID  https://stackoverflow.com/questions/56592063/how-to-convert-a-string-to-a-mongodb-objectid

  // "63ae16a9f202c8bf57525455", is stored in nameId
  //Object { currentTargetedNameId: "63ae16a9f202c8bf57525455" }

  await db.connect();

  // use the model we're updating,IndividualNames. Look through it to find the one document we're looking for with the name's id.
  const toUpdatePost = await IndividualPosts.findById(idToObjectId);

  console.log(`this is toupdatepost ${toUpdatePost}`);
  // result: this is toupdatename {
  //   _id: new ObjectId("63abc7d5650d1659f0dd305e"),
  //   name: 'donner',
  //   description: [],
  //   tags: [ 'christmas', 'male' ],
  //   likedby: [ '63a90c2e83e6366b179ffc40', '63ac0eb87795b89caaf760fe' ],
  //   __v: 0
  // }

  console.log(`this is user._id ${user._id}`);
  //result: this is user._id 63a90c2e83e6366b179ffc40

  // now that we have the right name, lets check if it has the current user's id inside of it
  //if true, lets filter the user out
  //  if false, lets add the user to the name object's likedby property

  toUpdatePost.likedby.includes(user._id)
    ? (toUpdatePost.likedby = toUpdatePost.likedby.filter(
        (userinlikedby) => userinlikedby != user._id
      ))
    : (toUpdatePost.likedby = toUpdatePost.likedby.concat(user._id));

  await toUpdatePost.save();
  await db.disconnect();
  res.send({
    message: "Names likes updated",
  });

  //if statement
}

export default handler;
