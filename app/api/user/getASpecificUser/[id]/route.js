import dbConnect from "@utils/db";
import Users from "@models/User";
import { ObjectId } from "mongodb";

export async function GET(req, context) {
  await dbConnect.connect();
  const { params } = context;
  try {
    const userId = ObjectId(params.id);

    const user = await Users.findById(userId).select(
      "name followers profileImage profileName bio location",
    );

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

// //get request
// //filter names so it only includes names which have the userid
// //names.filter(name=>name.likedby.includes(userId))

// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import dbConnect from "@utils/db";
// const ObjectId = require("mongodb").ObjectId;
// import Users from "@models/User";
// //wasn't working when everything was lowercase, had to be IndividualNames not individualNames for it to work

// export default async function handler(req, res) {
//   const userId = ObjectId(req.query.id);
//   const method = req.method;

//   await dbConnect.connect();

//   if (method === "GET") {
//     try {
//       const user = await Users.findById(userId).select(
//         "name followers name profileImage profileName bio location",
//       );
//       res.status(200).json(user);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   }
// }
