import dbConnect from "../../../../utils/db";
const ObjectId = require("mongodb").ObjectId;
import Posts from "../../../../models/posts";

export default async function handler(req, res) {
  const postId = ObjectId(req.query.id);
  const method = req.method;

  dbConnect.connect();

  if (method === "GET") {
    try {
      const post = await Posts.findById(postId).populate({
        path: "createdby",
        select: ["name", "profilename", "profileimage"],
      });

      res.status(200).json(post);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
