import dbConnect from "@/utils/db";
import NameLikes from "../../../../models/NameLikes";
export default async function handler(req, res) {
  await dbConnect();

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Fetch all Likes for this user
    const likes = await NameLikes.find({ userId }).select("nameId -_id"); // only return nameId
    const nameIds = likes.map((l) => l.nameId.toString());

    res.status(200).json({ nameIds });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// //get request
// //filter names so it only includes names which have the userid
// //names.filter(name=>name.likedby.includes(userId))

// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import dbConnect from "../../../../utils/db";

// import Names from "../../../../models/Names";
// //wasn't working when everything was lowercase, had to be IndividualNames not individualNames for it to work

// export default async function handler(req, res) {
//   const userId = req.query.id;
//   const method = req.method;

//   await dbConnect.connect();

//   if (method === "GET") {
//     try {
//       const individualNames = await Names.find({ likedby: userId }).populate({
//         path: "createdby",
//         select: ["name", "profilename", "profileimage"],
//       });
//       res.status(200).json(individualNames);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   }
// }
