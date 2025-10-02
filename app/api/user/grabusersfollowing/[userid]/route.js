import User from "@models/User";
import db from "@utils/db";

export async function GET(req, { params }) {
  await db.connect();
  const { userid } = await params;

  try {
    const usersFollowing = await User.find({
      followers: userid.toString(),
    }).select("name followers profileImage profileName bio location");

    return new Response(JSON.stringify(usersFollowing), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

// import User from "@models/User";
// import db from "@utils/db";
// const mongoose = require("mongoose");

// async function handler(req, res) {
//   const userid = req.query.userid;

//   if (req.method !== "GET") {
//     return res.status(400).send({ message: `${req.method} not supported` });
//   }

//   await db.connect();

//   try {
//     const usersFollowing = await User.find({
//       followers: userid.toString(),
//     }).select("name followers name profileImage profileName bio location");

//     res.status(200).json(usersFollowing);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// }

// export default handler;
