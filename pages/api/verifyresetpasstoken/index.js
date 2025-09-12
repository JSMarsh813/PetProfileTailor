import bcryptjs from "bcryptjs";
import User from "@models/User";
import db from "@utils/db";
import crypto from "crypto";
//crypto is a native node.js package

export default async function handler(req, res) {
  const { token } = req.body;
  console.log(token);

  await db.connect();

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  //check if theres a user with this token in the database
  console.log(`this is hashedToken ${hashedToken}`);

  const user = await User.findOne({
    passwordresettoken: hashedToken,
    resettokenexpires: { $gt: Date.now() },
  });

  console.log(`this is USER ${JSON.stringify(user)}`);

  if (user == null || !user) {
    res.status(404).json({
      message: "Invalid token or token has expired",
    });
    return;
  } else {
    res.status(200).json(user);
  }
}
