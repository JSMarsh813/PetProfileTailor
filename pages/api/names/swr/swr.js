//get request
//filter names so it only includes names which have the userid
//names.filter(name=>name.likedby.includes(userId))

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "../../../../config/connectmongodb";

import Names from "../../../../models/Names";
//wasn't working when everything was lowercase, had to be IndividualNames not individualNames for it to work

export default async function handler(req, res) {
  const method = req.method;
  const { page, limit } = req.query;
  console.log(`this is page ${page} with this many items ${limit}`);
  dbConnect(); //from config/mongo.js

  if (method === "GET") {
    try {
      const individualNames = await Names.find()
        .skip((page - 1) * limit)
        // page 0 * 10 items = 0
        // so no items skipped for page "0"

        //ex: page 1, has 10 items (limit). So it will skip page 1s's 10 items
        .limit(limit)
        //how many items per page
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
}