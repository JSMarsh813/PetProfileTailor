//get request
//filter names so it only includes names which have the userid
//names.filter(name=>name.likedby.includes(userId))

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "../../../../utils/db";

import BatSignalComments from "../../../../models/BatSignalComment";
//wasn't working when everything was lowercase, had to be IndividualNames not individualNames for it to work

export default async function handler(req, res) {
  const userId = req.query.nameid;
  const method = req.method;

  await dbConnect.connect();

  if (method === "GET") {
    try {
      const batSignalComments = await BatSignalComments.find({
        createdby: userId,
      }).populate({
        path: "createdby",
        select: ["name", "profilename", "profileimage"],
      });
      res.status(200).json(batSignalComments);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
