// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "@utils/db";
const mongoose = require("mongoose");
import Names from "@models/Names";
import regexInvalidInput from "@utils/stringManipulation/check-for-valid-names";
// eslint-disable-next-line no-unused-vars
import tags from "@models/NameTag";
//necessary or the tags won't populate

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect.connect();

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
    const { notes, content, tags, contentId } = req.body.submission;

    console.log(
      "notes in put request",
      notes,
      "put request",
      req.body.submission,
    );

    const toUpdateName = await Names.findById(contentId);

    if (!toUpdateName) {
      return res.status(404).json({ message: "Name not found" });
    }

    try {
      // Only check if user is actually changing the name
      if (
        content &&
        content.toLowerCase() !== (await toUpdateName.content.toLowerCase())
      ) {
        const existingNameCheck = await Names.findOne({
          content: { $regex: new RegExp(`^${content}$`, "i") },
        });

        if (existingNameCheck) {
          return res.status(409).json({
            message: `Ruh Roh! The name ${content} already exists`,
          });
        }
      }
      if (notes) {
        toUpdateName.notes = notes;
      }
      if (content) {
        toUpdateName.content = content;
      }

      if (tags) {
        toUpdateName.tags = tags;
      }

      await toUpdateName.save();

      const populateName = await Names.findById(contentId)
        .populate({
          path: "createdby",
          select: "name profilename profileimage",
        })
        .populate({ path: "tags", select: "tag" });

      res.send({
        data: populateName,
        message: "Name Updated",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  if (method === "POST") {
    const { content, notes, tags, createdby } = req.body;

    let existingNameCheck = await Names.find({
      content: { $regex: new RegExp(`^${content}$`, "i") },
    });
    // case-insensitive query
    // "mike" will get the name already exists error if it matches a "Mike", "MIKE", "mikE", etc.
    // he ^ and $ anchors make sure it only matches the full string (not substrings).

    let checkForInvalidInput = regexInvalidInput(content);
    console.log(checkForInvalidInput);

    if (existingNameCheck && existingNameCheck.length != 0) {
      res.status(409).json({
        message: `Ruh Roh! The name ${content} already exists`,
        existingName: existingNameCheck,
      });
      return;
    } else if (checkForInvalidInput != null) {
      res.status(400).json({
        message: `Ruh Roh! The name ${content} has invalid character(s) ${checkForInvalidInput}`,
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
      let idToObjectId = mongoose.Types.ObjectId(req.body.contentId);
      const test = await Names.deleteOne({ _id: idToObjectId });
      res.status(200).json({ success: true, msg: `Name Deleted ${test}` });
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
