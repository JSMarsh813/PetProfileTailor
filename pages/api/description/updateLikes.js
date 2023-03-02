import { getSession } from "next-auth/react";
import IndividualNames from "../../../models/individualNames";

import Description from "../../../models/description";
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

  // the things we're sending to update. In this case, we're sending the descriptions id in the request and then writing the logic later to determine what to change the current array to.
  const descriptionId = req.body.currentTargetedId; //!!!!
  console.log(req.body);
  //{ currentTargetedId: '63abc7d5650d1659f0dd305e' }

  console.log(`this is descriptionId ${descriptionId}`);
  // this is descriptionId 63abc7d5650d1659f0dd305e

  let idToObjectId = mongoose.Types.ObjectId(descriptionId);
  console.log(idToObjectId);
  //result: new ObjectId("63b7fe4362bf243a197c505d")

  // change the string id into an objectId, so it can be compared to the name's object id in the MongoDB database.
  //  CHANGE TO MONGODB ID  https://stackoverflow.com/questions/56592063/how-to-convert-a-string-to-a-mongodb-objectid

  // "63ae16a9f202c8bf57525455", is stored in nameId
  //Object { currentTargetedId: "63ae16a9f202c8bf57525455" }

  await db.connect();

  // use the model we're updating,IndividualNames. Look through it to find the one document we're looking for with the Description's id.
  const toUpdateDescription = await Description.findById(idToObjectId);

  console.log(`this is toupdatedescription ${toUpdateDescription}`);
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

  // now that we have the right Description, lets check if it has the current user's id inside of it
  //if true, lets filter the user out
  //  if false, lets add the user to the Description object's likedby property

  toUpdateDescription.likedby.includes(user._id)
    ? (toUpdateDescription.likedby = toUpdateDescription.likedby.filter(
        (userinlikedby) => userinlikedby != user._id
      ))
    : (toUpdateDescription.likedby = toUpdateDescription.likedby.concat(
        user._id
      ));

  await toUpdateDescription.save();
  await db.disconnect();
  res.send({
    message: "Descriptions likes updated",
  });

  //if statement
}

export default handler;
