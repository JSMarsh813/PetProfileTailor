// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "../../../../utils/db";
const ObjectId = require("mongodb").ObjectId;
import Descriptions from "../../../../models/description";
//wasn't working when everything was lowercase, had to be IndividualNames not individualNames for it to work

export default async function handler(req, res) {
  const descriptionId = ObjectId(req.query.id);

  const method = req.method;

  dbConnect.connect();

  if (method === "GET") {
    try {
      const individualDescription = await Descriptions.findById(
        descriptionId
      ).populate({
        path: "createdby",
        select: ["name", "profilename", "profileimage"],
      });
      res.status(200).json(individualDescription);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
