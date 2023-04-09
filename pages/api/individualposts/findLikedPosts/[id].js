//get request
//filter names so it only includes names which have the userid
//names.filter(name=>name.likedby.includes(userId))

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "../../../../utils/db";

import IndividualPosts from "../../../../models/posts";
//wasn't working when everything was lowercase, had to be IndividualNames not individualNames for it to work

export default async function handler(req, res) {
  const userId = req.query.id;
  const method = req.method;

  dbConnect.connect();

  if (method === "GET") {
    try {
      const individualPosts = await IndividualPosts.find({
        likedby: userId,
      }).populate({
        path: "createdby",
        select: ["name", "profilename", "profileimage"],
      });
      res.status(200).json(individualPosts);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
