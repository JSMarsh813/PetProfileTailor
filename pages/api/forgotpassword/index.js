import bcryptjs from "bcryptjs";
import User from "../../../models/User";
import db from "../../../utils/db";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
import { ResetPasswordEmail } from "../../../components/EmailTemplates/reset-password-template";

//crypto is a native node.js package

export default async function handler(req, res) {
  const { email } = req.body;
  console.log(email);

  await db.connect();

  const existingUser = await User.findOne({ email: email });
  console.log(existingUser);

  if (existingUser == null || !existingUser) {
    res.status(404).json({
      message: "Email does not exist",
    });
    return;
  }

  const emailResetPasswordToken = crypto.randomBytes(20).toString("hex");
  //for security, we want the token in the database and the url link in the email to be different
  const databaseResetPasswordToken = crypto
    .createHash("sha256")
    .update(emailResetPasswordToken)
    .digest("hex");

  const passwordResetExpires = Date.now() + 3600000; //will expire in 1 hour

  existingUser.passwordresettoken = databaseResetPasswordToken;
  existingUser.resettokenexpires = passwordResetExpires;

  const resetUrl = `${process.env.NEXTAUTH_URL}/resetpassword/${emailResetPasswordToken}`;
  const userName = existingUser.profilename;

  try {
    await existingUser.save();
    await resend.emails.send({
      from: `${process.env.RESEND_EMAIL_FROM}`,
      to: email,
      subject: "Reset Password",
      react: ResetPasswordEmail({
        userFirstname: userName,
        resetPasswordLink: resetUrl,
      }),
    });

    res.status(200).json({
      message: "Password reset email was sent",
    });
    return;
  } catch (error) {
    res.status(500).json(error);
  }
}
