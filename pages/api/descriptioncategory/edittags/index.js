import dbConnect from "@utils/db";

import Category from "@/models/DescriptionCategory";
import NameTag from "@models/NameTag";
import { checkIfAdmin } from "@/utils/auth/CheckIfAdmin";

export default async function handler(req, res) {
  const { method } = req;
  const { newtagid, categoriesToUpdate } = req.body.addTagsToCategorySubmission;

  await dbConnect.connect();
  console.log("request body", req.body);

  const session = await checkIfAdmin({
    req,
    res,
  });
  if (!session) return;

  if (method === "PUT") {
    try {
      const category = await Category.updateMany(
        {
          _id: { $in: categoriesToUpdate.map((category) => category) },
        },
        { $push: { tags: newtagid } },
      );
      res.status(200).json(category);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
