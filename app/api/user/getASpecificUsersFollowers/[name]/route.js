import dbConnect from "@utils/db";
import Users from "@models/User";

export async function GET(req, { params }) {
  await dbConnect.connect();

  const { name } = await params;

  try {
    const user = await Users.findOne({ name })
      .select("name followers profileImage profileName bio location")
      .populate("followers", "name profileName profileImage"); // select fields for followers

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
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

// export default async function handler(req, res) {
//   const profileName = req.query.name;

//   const method = req.method;

//   await dbConnect.connect();

//   if (method === "GET") {
//     try {
//       const user = await Users.find({ profileName })
//         .select("name followers name profileImage profileName bio location")
//         .populate("followers");
//       if (user == []) {
//         console.log("error");
//         return res.status(404).send();
//       }
//       res.status(200).json(user);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   }
// }
