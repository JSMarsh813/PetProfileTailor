import dbConnect from "../../../config/connectmongodb";
import Names from "../../../models/Names";

export default async function getnamecount(req, res) {
  const method = req.method;

  dbConnect();

  if (method === "GET") {
    try {
      const countOfNames = await Names.find();
      res.status(200).json(countOfNames);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
