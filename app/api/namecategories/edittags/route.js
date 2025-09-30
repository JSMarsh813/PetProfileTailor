import dbConnect from "@utils/db";
import Category from "@models/NameCategory";
import { checkIfAdmin } from "@/utils/api/checkIfAdmin";
import { NextResponse } from "next/server";

// ---------------- PUT (add tag(s) to multiple categories, admin only) ----------------
export async function PUT(req) {
  await dbConnect.connect();

  try {
    const { ok } = await checkIfAdmin({ req });
    if (!ok) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { newtagid, categoriesToUpdate } = await req.json();

    const category = await Category.updateMany(
      { _id: { $in: categoriesToUpdate } },
      { $push: { tags: newtagid } },
    );

    return NextResponse.json(category, { status: 200 });
  } catch (err) {
    console.error("Error updating categories:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// import dbConnect from "@utils/db";
// import Category from "@models/NameCategory";
// import NameTag from "@models/NameTag";
// import { checkIfAdmin } from "@/utils/api/checkIfAdmin";

// export default async function handler(req, res) {
//   const { method } = req;
//   const { newtagid, categoriesToUpdate } = req.body.addTagsToCategorySubmission;

//   await dbConnect.connect();

//   if (method === "PUT") {
//     try {
//       const { ok, session } = await checkIfAdmin({
//         req,
//         res,
//       });
//       if (!ok) {
//         return;
//       }

//       const category = await Category.updateMany(
//         {
//           _id: { $in: categoriesToUpdate.map((category) => category) },
//         },
//         { $push: { tags: newtagid } },
//       );
//       res.status(200).json(category);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   }
// }
