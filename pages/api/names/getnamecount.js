import dbConnect from "../../../utils/db";
import Names from "../../../models/Names";

export default async function getnamecount(req, res) {
  const method = req.method;

  await dbConnect.connect();

  if (method === "GET") {
    try {
      const countOfNames = await Names.find();
      res.status(200).json(countOfNames);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
