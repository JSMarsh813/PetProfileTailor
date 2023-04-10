import dbConnect from "../../../../../utils/db";
const ObjectId = require("mongodb").ObjectId;
import Comments from "../../../../../models/namecomment";

export default async function handler(req, res) {
  const commentId = ObjectId(req.query.id);

  const method = req.method;

  await dbConnect.connect();

  if (method === "GET") {
    try {
      const individualComment = await Comments.find({
        _id: commentId,
      }).populate({
        path: "createdby",
        select: ["name", "profilename", "profileimage"],
      });

      res.status(200).json(individualComment);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
