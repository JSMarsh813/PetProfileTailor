import dbConnect from "@utils/db";
import Category from "@/models/DescriptionCategory";
import descriptiontag from "@/models/DescriptionTag";
import { checkIfAdmin } from "@/utils/api/CheckIfAdmin";

export default async function handler(req, res) {
  const { method } = req;

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
      const { ok, session } = await checkIfAdmin({
        req,
        res,
      });
      if (!ok) {
        return;
      }

      const newDescriptionCategory = await Category.create({
        ...req.body,
        createdby: session.user.id,
      });
      res.status(201).json(newDescriptionCategory);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
