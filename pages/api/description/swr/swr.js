import dbConnect from "../../../../config/connectmongodb";
import Description from "../../../../models/description";

export default async function handler(req, res) {
  const method = req.method;
  const { page, limit } = req.query;
  console.log(`this is page ${page} with this many items ${limit}`);
  dbConnect(); //from config/mongo.js

  if (method === "GET") {
    try {
      const descriptionList = await Description.find()
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
      res.status(200).json(descriptionList);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
