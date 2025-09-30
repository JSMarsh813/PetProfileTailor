import dbConnect from "@utils/db";
import NameTag from "@models/NameTag";
import { checkIfAdmin } from "@/utils/api/checkIfAdmin";
import { NextResponse } from "next/server";

// ---------------- GET (fetch all name tags) ----------------
export async function GET() {
  await dbConnect.connect();

  try {
    const nametag = await NameTag.find();
    return NextResponse.json(nametag, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ---------------- POST (create name tag, admin only) ----------------
export async function POST(req) {
  await dbConnect.connect();

  try {
    const { ok, session } = await checkIfAdmin({ req });
    if (!ok) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const nametag = await NameTag.create({
      ...body,
      createdBy: session.user.id,
    });

    return NextResponse.json(nametag, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import dbConnect from "@utils/db";
// import NameTag from "@models/NameTag";
// import { checkIfAdmin } from "@/utils/api/checkIfAdmin";

// export default async function handler(req, res) {
//   const { method } = req;

//   await dbConnect.connect();

//   if (method === "GET") {
//     try {
//       const nametag = await NameTag.find();

//       res.status(200).json(nametag);
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
//       const nametag = await NameTag.create({
//         ...req.body,
//         createdBy: session.user.id,
//       });
//       res.status(201).json(nametag);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   }
// }
