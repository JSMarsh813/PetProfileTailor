// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "@utils/db";
const mongoose = require("mongoose");
import Description from "@/models/Description";
//wasn't working when everything was lowercase, had to be IndividualNames not individualNames for it to work

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect.connect();

  if (method === "GET") {
    try {
      const descriptions = await Description.find()
        .populate({
          path: "createdby",
          select: ["name", "profilename", "profileimage"],
        })
        .populate({ path: "tags", select: ["tag"] });

      res.status(200).json(descriptions);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  if (method === "PUT") {
    const { description, tags, notes, descriptionId, relatednames } =
      req.body.descriptionSubmission;

    const toUpdateDescription = await Description.findById(descriptionId);

    try {
      if (notes) {
        toUpdateDescription.notes = notes;
      }
      if (relatednames) {
        toUpdateDescription.relatednames = relatednames;
      }
      toUpdateDescription.description = description;

      toUpdateDescription.tags = tags;

      await toUpdateDescription.save();

      res.send({
        message: "Description Updated",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  if (method === "POST") {
    const { description } = req.body;
    //tags, notes, createdby, relatednames

    let existingDescriptionCheck = await Description.find({
      description: description,
    });

    if (existingDescriptionCheck && existingDescriptionCheck.length != 0) {
      res.status(409).json({
        message: "Description already exists",
        existingDescription: existingDescriptionCheck,
      });
      return;
    } else {
      try {
        const test = await Description.create(req.body);
        res.status(201).json(test);
      } catch (err) {
        res.status(500).json(err);
      }
    }
  }

  if (method === "DELETE") {
    try {
      let idToObjectId = mongoose.Types.ObjectId(req.body.contentId);

      console.log(idToObjectId);
      console.log(req.body);
      const test = await Description.deleteOne({ _id: idToObjectId });

      res.status(200).json({
        success: true,
        msg: `Description Deleted ${test}`,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
