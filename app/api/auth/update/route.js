import bcryptjs from "bcryptjs";
import User from "@models/User";
import db from "@utils/db";
import { getSessionForApis } from "@/utils/api/getSessionForApis";
import { NextResponse } from "next/server";

export async function PUT(req) {
  const body = await req.json();
  const { name, email, password } = body;

  if (!name || !email || !email.includes("@")) {
    return NextResponse.json({ message: "Validation error" }, { status: 422 });
  }

  await db.connect();

  const { ok, session } = await getSessionForApis({ req });
  if (!ok || !session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;
  const toUpdateUser = await User.findById(userId);

  if (!toUpdateUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  toUpdateUser.name = name;
  toUpdateUser.email = email;

  if (password) {
    toUpdateUser.password = bcryptjs.hashSync(password);
  }

  await toUpdateUser.save();

  return NextResponse.json({ message: "User updated" });
}

// import bcryptjs from "bcryptjs";
// import User from "@models/User";
// import db from "@utils/db";

// import { getSessionForApis } from "@/utils/api/getSessionForApis";

// async function handler(req, res) {
//   if (req.method !== "PUT") {
//     return res.status(400).send({ message: `${req.method} not supported` });
//   }

//   const { name, email, password } = req.body;

//   if (!name || !email || !email.includes("@")) {
//     res.status(422).json({
//       message: "Validation error",
//     });
//     return;
//   }

//   await db.connect();

//   const { ok, session } = await getSessionForApis({
//     req,
//     res,
//   });
//   if (!ok) {
//     return;
//   }

//   const userId = session.user.id;

//   const toUpdateUser = await User.findById(userId);
//   toUpdateUser.name = name;
//   toUpdateUser.email = email;

//   if (password) {
//     toUpdateUser.password = bcryptjs.hashSync(password);
//   }

//   await toUpdateUser.save();

//   res.send({
//     message: "User updated",
//   });
// }

// export default handler;
