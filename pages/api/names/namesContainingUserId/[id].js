//get request
//filter names so it only includes names which have the userid
//names.filter(name=>name.likedby.includes(userId))

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "../../../../config/connectmongodb";

import Names from "../../../../models/Names";
//wasn't working when everything was lowercase, had to be IndividualNames not individualNames for it to work

export default async function handler(req, res) {
  const userId = req.query.id;
  const method = req.method;

  dbConnect(); //from config/mongo.js

  if (method === "GET") {
    try {
      const individualNames = await Names.find({ createdby: userId }).populate({
        path: "createdby",
        select: ["name", "profilename", "profileimage"],
      });
      res.status(200).json(individualNames);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
