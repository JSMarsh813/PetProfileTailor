// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import db from "../../../../utils/db";
const mongoose = require("mongoose");
import FlagReport from "../../../../models/FlagReport";
//wasn't working when everything was lowercase, had to be IndividualPosts not individualNames for it to work

export default async function handler(req, res) {
  const { method } = req;
  const contenttype = req.body.contenttype;
  console.log(contenttype);

  await db.connect();

  if (method === "GET") {
    res.status(404);
  }

  if (method === "PUT") {
    res.status(404);
  }

  if (method === "POST") {
    const {
      contentid,
      contenttype,
      maincontent,
      secondarycontent,
      createdbyuser,
      comments,
      flagcategories,
      flaggedbyusers,
    } = req.body;

    res.status(201).send({
      message: `this is type {$type}`,
    });

    // if (!description || !replyingtothisid || !createdby) {
    //   res.status(422).json({
    //     message: "Validation error",
    //   });
    //   return;
    // }

    // const newComment = new BatSignalComment({
    //   image,
    //   parentcommentid,
    //   description,
    //   replyingtothisid,
    //   createdby,
    // });

    const report = await FlagReport.save();
    console.log();
    //create new user with .save from mongoose

    // res.status(201).send({
    //   message: "Created post!",

    //   _id: comment._id,
    //   image: comment.image,
    //   parentcommentid: comment.parentcommentid,
    //   description: comment.description,
    //   replyingtothisid: comment.replyingtothisid,
    //   createdby: comment.createdby,
    // });
  }

  if (method === "DELETE") {
    res.status(404);
  }
}
