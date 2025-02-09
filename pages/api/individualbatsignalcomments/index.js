// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import db from "../../../utils/db";
const mongoose = require("mongoose");
import BatSignalComment from "../../../models/BatSignalComment";
//wasn't working when everything was lowercase, had to be IndividualPosts not individualNames for it to work

export default async function handler(req, res) {
  const { method } = req;

  await db.connect();

  if (method === "GET") {
    try {
      const batSignalComment = await BatSignalComment.find().populate({
        path: "createdby",
        select: ["name", "profilename", "profileimage"],
      });

      // .sort({_id:-1});
      //this way we get the most recent posts first, we use id since mongoDB's objectID has a 4 byte timestamp naturally built in
      res.status(200).json(batSignalComment);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  if (method === "PUT") {
    const { description, commentId } = req.body.commentSubmission;

    try {
      const toUpdateBatSignalComment = await BatSignalComment.findById(
        commentId,
      );

      toUpdateBatSignalComment.description = description;

      await toUpdateBatSignalComment.save();
      //  res.status(201).json(toUpdateBatSignalComment)
      res.send({
        message: "Comment updated",
      });
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  }

  if (method === "POST") {
    const { image, parentcommentid, description, createdby, replyingtothisid } =
      req.body;

    if (!description || !replyingtothisid || !createdby) {
      res.status(422).json({
        message: "Validation error",
      });
      return;
    }

    const newComment = new BatSignalComment({
      image,
      parentcommentid,
      description,
      replyingtothisid,
      createdby,
    });

    const comment = await newComment.save();
    //create new user with .save from mongoose

    res.status(201).send({
      message: "Created post!",

      _id: comment._id,
      image: comment.image,
      parentcommentid: comment.parentcommentid,
      description: comment.description,
      replyingtothisid: comment.replyingtothisid,
      createdby: comment.createdby,
    });
  }

  if (method === "DELETE") {
    try {
      // let idToObjectId = mongoose.Types.ObjectId(req.body.commentId);
      let contentId = req.body.contentId;
      const test = await BatSignalComment.deleteOne({ _id: contentId });
      res.status(200).json({ success: true, msg: `Comment Deleted ${test}` });
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
