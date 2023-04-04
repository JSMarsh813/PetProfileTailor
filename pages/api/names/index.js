// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "../../../config/connectmongodb";
const mongoose = require("mongoose");
import Names from "../../../models/Names";

// eslint-disable-next-line no-unused-vars
import tags from "../../../models/NameTag";
//necessary or the tags won't populate

export default async function handler(req, res) {
  const { method } = req;

  dbConnect(); //from config/mongo.js

  if (method === "GET") {
    try {
      const individualNames = await Names.find()
        .populate({
          path: "createdby",
          select: ["name", "profilename", "profileimage"],
        })
        .populate({ path: "tags", select: ["tag"] });
      res.status(200).json(individualNames);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  if (method === "PUT") {
    const { description, name, tags, nameId } = req.body.nameSubmission;

    const toUpdateName = await Names.findById(nameId);

    try {
      if (description) {
        toUpdateName.description = description;
      }
      toUpdateName.name = name;

      toUpdateName.tags = tags;

      await toUpdateName.save();

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

    if (existingNameCheck && existingNameCheck.length != 0) {
      res.status(409).json({
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
      let idToObjectId = mongoose.Types.ObjectId(req.body.itemId);
      const test = await Names.deleteOne({ _id: idToObjectId });
      res.status(200).json({ success: true, msg: `Name Deleted ${test}` });
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
