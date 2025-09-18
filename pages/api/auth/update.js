import bcryptjs from "bcryptjs";
import User from "@models/User";
import db from "@utils/db";

import { getSessionForApis } from "@/utils/api/getSessionForApis";

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !email.includes("@")) {
    res.status(422).json({
      message: "Validation error",
    });
    return;
  }

  await db.connect();

  const session = await getSessionForApis({
    req,
    res,
  });
  if (!session) return null;

  const userId = session.user.id;

  const toUpdateUser = await User.findById(userId);
  toUpdateUser.name = name;
  toUpdateUser.email = email;

  if (password) {
    toUpdateUser.password = bcryptjs.hashSync(password);
  }

  await toUpdateUser.save();

  res.send({
    message: "User updated",
  });
}

export default handler;
