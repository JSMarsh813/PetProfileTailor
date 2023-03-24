import dbConnect from "../../../../config/connectmongodb";
import Names from "../../../../models/Names";
import Users from "../../../../models/User";
import Tags from "../../../../models/NameTag";
export default async function handler(req, res) {
  const method = req.method;
  const { page, limit, sort } = req.query;
  console.log(`this is page ${page} with this many items ${limit}`);
  dbConnect();

  console.log(req.query.sort);
  if (method === "GET") {
    try {
      const individualNames = await Names.find()
        .sort({ _id: sort })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
          path: "createdby",
          select: ["name", "profilename", "profileimage"],
        })
        .populate({ path: "tags", select: ["tag"] });

      res.status(200).json(individualNames);
    } catch (err) {
      res.status(500).json(err);
      console.log(`this is an error ${JSON.stringify(err)}`);
    }
  }
}
