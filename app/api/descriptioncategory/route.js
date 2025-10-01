import dbConnect from "@utils/db";
import Category from "@/models/DescriptionCategory";
import descriptiontag from "@/models/DescriptionTag";
import { checkIfAdmin } from "@/utils/api/checkIfAdmin";

export async function GET() {
  await dbConnect.connect();

  try {
    const category = await Category.find().populate("tags");
    return Response.json(category, { status: 200 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect.connect();

  try {
    const { ok, session, response } = await checkIfAdmin({ req });

    if (!ok) return response;

    const body = await req.json();

    const newDescriptionCategory = await Category.create({
      ...body,
      createdBy: session.user.id,
    });

    return Response.json(newDescriptionCategory, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// export default async function handler(req, res) {
//   const { method } = req;

//   await dbConnect.connect();

//   if (method === "GET") {
//     try {
//       const category = await Category.find().populate("tags");
//       res.status(200).json(category);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   }

//   if (method === "POST") {
//     try {
//       const { ok, session } = await checkIfAdmin({
//         req,
//         res,
//       });
//       if (!ok) {
//         return;
//       }

//       const newDescriptionCategory = await Category.create({
//         ...req.body,
//         createdBy: session.user.id,
//       });
//       res.status(201).json(newDescriptionCategory);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   }
// }
