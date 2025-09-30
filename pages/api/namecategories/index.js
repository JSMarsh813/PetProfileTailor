import dbConnect from "@utils/db";
import Category from "@models/NameCategory";
import NameTag from "@models/NameTag";
import { checkIfAdmin } from "@/utils/api/checkIfAdmin";

export default async function handler(req, res) {
  const { method } = req;
  const newCategory = req.body;

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
    const { ok, session } = await checkIfAdmin({
      req,
      res,
    });
    if (!ok) {
      return;
    }

    try {
      const category = await Category.create({
        ...newCategory,
        createdBy: session.user.id,
      });
      res.status(200).json(category);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
