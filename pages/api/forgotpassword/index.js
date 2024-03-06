import bcryptjs from "bcryptjs";
import User from "../../../models/User";
import db from "../../../utils/db";
import crypto from "crypto";
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
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

  // await existingUser.save();
  // res.send({
  //   message: "email is sent for resetting password",
  // });

  //WILL NEED TO CHANGE LATER so its no longer looking at local host
  const resetUrl = `localhost:3000/resetpassword/${emailResetPasswordToken}`;
  console.log(resetUrl);

  try {
    await existingUser.save();
    res.status(200).json({
      message: "email is sent for resetting password",
    });
    return;
  } catch (error) {
    res.status(500).json(error);
  }

  const body = "Reset Password by clicking on the following url: " + resetUrl;
  // const msg = {
  //   to: email,
  //   from: "petprofiletailor@gmail.com",
  //   subject: "Reset Password",
  //   text: body,
  // };
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY_RESET_PASSWORD || "");
  // // ||"" for validation
  // sgMail
  //   .send(msg)
  //   .then(() => {
  //     res.status(200).json({
  //       message: "Reset password sent",
  //     });
  //     return;
  //   })
  //   .catch(async (error) => {
  //     existingUser.passwordResetToken = undefined;
  //     existingUser.resetTokenExpires = undefined;
  //     await existingUser.save();

  //     res.status(400).json({
  //       message: "Failed sending email, try again",
  //     });
  //     return;
  //   });

  // try {
  //   await existingUser.save();
  //   res.status(200).json({
  //     message: "email is sent for resetting password",
  //   });
  //   return;
  // } catch (error) {
  //   res.status(500).json(error);
  //   return;
  // }

  //https://www.youtube.com/watch?v=sO5df9FVIT8&list=PLIcotye6qKVORDtJeGNfCF6_Xs5-YwJTm&index=1 18ish minutes in

  //   res.status(201).send({
  //     message: "Created user!",
  //     _id: user._id,
  //     profilename: user.profilename,
  //     name: user.name,
  //     email: user.email,
  //   });
}
