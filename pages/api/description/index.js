// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "@utils/db";
const mongoose = require("mongoose");
import Description from "@/models/Description";
//wasn't working when everything was lowercase, had to be IndividualNames not individualNames for it to work
import { checkOwnership } from "@/utils/api/checkOwnership";
import { getSessionForApis } from "@/utils/api/getSessionForApis";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect.connect();

  if (method === "GET") {
    try {
      const descriptions = await Description.find()
        .populate({
          path: "createdBy",
          select: ["name", "profileName", "profileImage"],
        })
        .populate({ path: "tags", select: ["tag"] });

      res.status(200).json(descriptions);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  if (method === "PUT") {
    const { notes, content, tags, contentId } = req.body.submission;

    const toUpdateDescription = await Description.findById(contentId);

    const { ok } = await checkOwnership({
      req,
      res,
      resourceCreatorId: toUpdateDescription.createdBy,
    });
    if (!ok) {
      return;
    }
    try {
      if (notes) {
        toUpdateDescription.notes = notes;
      }

      toUpdateDescription.content = content;

      toUpdateDescription.tags = tags;

      await toUpdateDescription.save();

      const updatedDescription = await Description.findById(contentId)
        .populate({
          path: "createdBy",
          select: "name profileName profileImage",
        })
        .populate({ path: "tags", select: "tag" });

      res.send({
        data: updatedDescription,
        message: "Description Updated",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }

  if (method === "POST") {
    const { description } = req.body;
    //tags, notes, createdBy

    const { ok, session } = await getSessionForApis({
      req,
      res,
    });
    if (!ok) {
      return;
    }

    let existingDescriptionCheck = await Description.find({
      content: description,
    });

    if (existingDescriptionCheck && existingDescriptionCheck.length != 0) {
      res.status(409).json({
        message: "Description already exists",
        existingDescription: existingDescriptionCheck,
      });
      return;
    } else {
      try {
        const test = await Description.create({
          ...req.body,
          createdBy: session.user.id,
        });
        res.status(201).json(test);
      } catch (err) {
        res.status(500).json(err);
      }
    }
  }

  if (method === "DELETE") {
    try {
      let idToObjectId = mongoose.Types.ObjectId(req.body.contentId);
      const nameToBeDeleted = await Description.findById(idToObjectId);

      const { ok } = await checkOwnership({
        req,
        res,
        resourceCreatorId: nameToBeDeleted.createdBy,
      });
      if (!ok) {
        return;
      }
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
