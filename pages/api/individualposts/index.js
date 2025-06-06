// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "../../../utils/db";
import db from "../../../utils/db";
const mongoose = require("mongoose");

import IndividualPosts from "../../../models/Post";
//wasn't working when everything was lowercase, had to be IndividualPosts not individualNames for it to work

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    await dbConnect.connect();
    try {
      const individualPosts = await IndividualPosts.find()
        .populate({
          path: "createdby",
          select: ["name", "profilename", "profileimage"],
        })
        // .populate({path:"comments"})

        .sort({ _id: -1 });
      //this way we get the most recent posts first, we use id since mongoDB's objectID has a 4 byte timestamp naturally built in
      res.status(200).json(individualPosts);
    } catch (err) {
      res.status(500).json(err);
    }
  }
  //  ################### PUT REQUEST ###################

  if (req.method === "PUT") {
    // return res.status(400).send({ message: `${req.method} not supported` });

    //createdby doesn't seem necessary
    const { image, title, description, createdby, taglist, postid, alttext } =
      req.body.postSubmission;

    await db.connect();

    const toUpdatePost = await IndividualPosts.findById(postid);

    if (image) {
      toUpdatePost.image = image;
    }

    if (alttext) {
      toUpdatePost.alttext = alttext;
    }

    if (title) {
      toUpdatePost.title = title;
    }
    if (title) {
      toUpdatePost.title = title;
    }
    toUpdatePost.description = description;
    toUpdatePost.taglist = taglist;

    await toUpdatePost.save();

    res.send({
      message: "User updated",
    });
  }

  if (method === "POST") {
    try {
      const test = await IndividualPosts.create(req.body);
      res.status(201).json(test);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  //  ################### DELETE REQUEST ###################

  if (method === "DELETE") {
    try {
      let idToObjectId = mongoose.Types.ObjectId(req.body.contentId);
      const test = await IndividualPosts.deleteOne({ _id: idToObjectId });
      res.status(200).json({ success: true, msg: `Post Deleted ${test}` });
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
