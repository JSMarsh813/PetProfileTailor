import User from "@models/User";
import db from "@utils/db";
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
  const body = await req.json();
  const { newProfileImage } = body;

  const toUpdateUser = await User.findById(userId);
  if (!toUpdateUser) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });
  }

  toUpdateUser.profileImage = newProfileImage;
  await toUpdateUser.save();

  return new Response(JSON.stringify({ message: "Profile image updated" }), {
    status: 200,
  });
}

// import User from "@models/User";
// import db from "@utils/db";
// const cloudinary = require("cloudinary").v2;
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

//   //session info
//   const userId = session.user.id;

//   // no req is appearing in console...

//   const newProfileImage = req.body.newProfileImage;

//   await db.connect();
//   const toUpdateUser = await User.findById(userId);
//   toUpdateUser.profileImage = newProfileImage;

//   await toUpdateUser.save();

//   res.send({
//     message: "Profile Image updated",
//   });
// }

// export default handler;
