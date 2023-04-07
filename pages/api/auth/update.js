import bcryptjs from "bcryptjs";
import User from "../../../models/User";
import db from "../../../utils/db";

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const { name, email, password, userid } = req.body;

  if (!name || !email || !email.includes("@")) {
    res.status(422).json({
      message: "Validation error",
    });
    return;
  }

  await db.connect();

  const toUpdateUser = await User.findById(userid);
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
