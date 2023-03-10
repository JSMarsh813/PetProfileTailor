import { getSession } from "next-auth/react";

import User from "../../../../models/User";
import db from "../../../../utils/db";
const mongoose = require("mongoose");

async function handler(req, res) {
  const userid = req.query.userid;

  if (req.method !== "GET") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  await db.connect();

  try {
    const usersFollowing = await User.find({
      followers: userid.toString(),
    }).select("name followers name profileimage profilename bioblurb location");

    res.status(200).json(usersFollowing);

    await db.disconnect();
  } catch (err) {
    res.status(500).json(err);
  }
}

export default handler;
