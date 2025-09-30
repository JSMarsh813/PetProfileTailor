import User from "@models/User";
import db from "@utils/db";
import mongoose from "mongoose";
import { getSessionForApis } from "@/utils/api/getSessionForApis";

export async function PUT(req) {
  await db.connect();

  const { ok, session } = await getSessionForApis({ req });
  if (!ok) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), {
      status: 401,
    });
  }

  const userId = session.user.id;
  const { bio, location } = (await req.json()).bioSubmission;

  const objectId = mongoose.Types.ObjectId(userId);

  try {
    const user = await User.findById(objectId);
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    user.bio = bio;
    user.location = location;

    await user.save();

    return new Response(JSON.stringify({ message: "Profile updated" }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}

// import User from "@models/User";
// import db from "@utils/db";
// const mongoose = require("mongoose");
// import { getSessionForApis } from "@/utils/api/getSessionForApis";

// async function handler(req, res) {
//   if (req.method !== "PUT") {
//     return res.status(400).send({ message: `${req.method} not supported` });
//   }

//   const { ok, session } = await getSessionForApis({
//     req,
//     res,
//   });
//   if (!ok) {
//     return;
//   }

//   const userid = session.user.id;

//   const { bio, location } = req.body.bioSubmission;

//   let idToObjectId = mongoose.Types.ObjectId(userid);

//   await db.connect();

//   const toUpdateUserBioLocationAvatar = await User.findById(idToObjectId);

//   toUpdateUserBioLocationAvatar.bio = bio;

//   toUpdateUserBioLocationAvatar.location = location;

//   await toUpdateUserBioLocationAvatar.save();

//   res.send({
//     message: "Profile updated",
//   });
// }

// export default handler;
