import dbConnect from "@utils/db";
import Category from "@/models/DescriptionCategory";
import NameTag from "@models/NameTag";
import { checkIfAdmin } from "@/utils/api/checkIfAdmin";

export async function PUT(req) {
  await dbConnect.connect();

  const { ok, session, response } = await checkIfAdmin({ req });
  if (!ok) return response; // unauthorized → return early

  try {
    const { newtagid, categoriesToUpdate } = await req.json();

    const category = await Category.updateMany(
      {
        _id: { $in: categoriesToUpdate },
      },
      { $push: { tags: newtagid } },
    );

    return Response.json(category, { status: 200 });
  } catch (err) {
    console.error("Error updating categories:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
