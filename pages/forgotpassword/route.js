import bcryptjs from "bcryptjs";
import User from "../../../models/User";
import db from "../../../utils/db";
import crypto from "crypto";
//crypto is a native node.js package

async function handler(req, res) {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    res.status(422).json({
      message: "Validation error",
    });
    return;
  }

  await db.connect();

  const existingUser = await User.findOne({ email: email });
  if (!existingUser) {
    res.status(422).json({ message: "Email doesn't exist!" });

    return;
  }

  const emailResetPasswordToken = crypto.randomBytes(20).toString("hex");
  //for security, we want the token in the database and the url link in the email to be different
  const databaseResetPasswordToken = crypto
    .createHash("sha256")
    .update(emailResetPasswordToken)
    .digest("hex");

  const passwordResetExpires = Date.now() + 3600000; //will expire in 1 hour

  existingUser.passwordResetToken = databaseResetPasswordToken;
  existingUser.resetTokenExpires = passwordResetExpires;

  //WILL NEED TO CHANGE LATER so its no longer looking at local host
  const resetUrl = `localhost:3000/reset-password/${emailResetPasswordToken}`;
  console.log(resetUrl);

  //https://www.youtube.com/watch?v=sO5df9FVIT8&list=PLIcotye6qKVORDtJeGNfCF6_Xs5-YwJTm&index=1 18ish minutes in

  //   res.status(201).send({
  //     message: "Created user!",
  //     _id: user._id,
  //     profilename: user.profilename,
  //     name: user.name,
  //     email: user.email,
  //   });
}

export default handler;
