// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "@utils/db";

import Descriptions from "@/models/Description";
//wasn't working when everything was lowercase, had to be IndividualNames not individualNames for it to work

export default async function handler(req, res) {
  const userId = req.query.id;
  const method = req.method;

  await dbConnect.connect();

  if (method === "GET") {
    try {
      const individualNames = await Descriptions.find({
        likedby: userId,
      }).populate({
        path: "createdby",
        select: ["name", "profilename", "profileimage"],
      });
      res.status(200).json(individualNames);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
