import bcryptjs from "bcryptjs";
import User from "@models/User";
import db from "@utils/db";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { token } = await req.json();
  console.log("Received token:", token);

  await db.connect();

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  console.log("Hashed token:", hashedToken);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    resetTokenExpires: { $gt: Date.now() },
  });

  console.log("Found user:", user);

  if (!user) {
    return NextResponse.json(
      { message: "Invalid token or token has expired" },
      { status: 404 },
    );
  }

  return NextResponse.json(user, { status: 200 });
}

// import bcryptjs from "bcryptjs";
// import User from "@models/User";
// import db from "@utils/db";
// import crypto from "crypto";
// //crypto is a native node.js package

// export default async function handler(req, res) {
//   const { token } = req.body;
//   console.log(token);

//   await db.connect();

//   const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

//   //check if theres a user with this token in the database
//   console.log(`this is hashedToken ${hashedToken}`);

//   const user = await User.findOne({
//     passwordResetToken: hashedToken,
//     resetTokenExpires: { $gt: Date.now() },
//   });

//   console.log(`this is USER ${JSON.stringify(user)}`);

//   if (user == null || !user) {
//     res.status(404).json({
//       message: "Invalid token or token has expired",
//     });
//     return;
//   } else {
//     res.status(200).json(user);
//   }
// }
