import dbConnect from "../../../utils/db";
import Category from "../../../models/nameCategory";
import NameTag from "../../../models/NameTag";

export default async function handler(req, res) {
  const { method } = req;
  const newcategory = req.body;

  await dbConnect.connect();

  if (method === "GET") {
    try {
      const category = await Category.find().populate("tags");
      res.status(200).json(category);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  if (method === "POST") {
    try {
      const category = await Category.create(newcategory);
      res.status(200).json(category);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
