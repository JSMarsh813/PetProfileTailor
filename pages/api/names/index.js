// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "../../../config/connectmongodb";
const mongoose = require("mongoose");
import Names from "../../../models/Names";
//wasn't working when everything was lowercase, had to be IndividualNames not individualNames for it to work

export default async function handler(req, res) {
  const { method } = req;

  dbConnect(); //from config/mongo.js

  if (method === "GET") {
    try {
      const individualNames = await Names.find().populate({
        path: "createdby",
        select: ["name", "profilename", "profileimage"],
      });
      res.status(200).json(individualNames);
    } catch (err) {
      res.status(500).json(err);
    }

    // try {
    //   const names = await individualNames.find();
    //   res.status(200).json(individualNames);

    // } catch (err) {
    //   res.status(500).json(err);
    // }
  }

  if (method === "PUT") {
    const { description, name, tags, nameId } = req.body.nameSubmission;

    const toUpdateName = await Names.findById(nameId);
    console.log(toUpdateName);
    try {
      if (description) {
        toUpdateName.description = description;
      }
      toUpdateName.name = name;

      toUpdateName.tags = tags;

      await toUpdateName.save();
      // await db.disconnect();
      res.send({
        message: "Name Updated",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  if (method === "POST") {
    const { name, description, tags, createdby } = req.body;

    let existingNameCheck = await Names.find({ name: name });
    console.log(existingNameCheck);

    if (existingNameCheck && existingNameCheck.length != 0) {
      res
        .status(409)
        .json({
          message: "Name already exists",
          existingName: existingNameCheck,
        });
      return;
    } else {
      try {
        const test = await Names.create(req.body);
        res.status(201).json(test);
      } catch (err) {
        res.status(500).json(err);
      }
    }
  }

  if (method === "DELETE") {
    try {
      console.log(`request body is ${JSON.stringify(req.body.itemId)}`);

      let idToObjectId = mongoose.Types.ObjectId(req.body.itemId);
      const test = await Names.deleteOne({ _id: idToObjectId });
      res.status(200).json({ success: true, msg: `Name Deleted ${test}` });
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
