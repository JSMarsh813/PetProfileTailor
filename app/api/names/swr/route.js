import dbConnect from "@utils/db.js";
import Names from "@models/Name.js";
import mongoose from "mongoose";

export async function GET(req) {
  return handleRequest(req);
}

export async function POST(req) {
  return handleRequest(req);
}

async function handleRequest(req) {
  await dbConnect.connect();

  const limit = 50;
  const method = req.method;

  let source = {};

  if (method === "POST") {
    try {
      const body = await req.json();
      if (body && Object.keys(body).length > 0) {
        source = body; // POST with body
      } else {
        source = {}; // POST with empty body → treat as GET
      }
    } catch (err) {
      // If parsing fails (empty body), treat as GET
      source = {};
    }
    //  Merge in query parameters too (so ?page=2 still works, otherwise you'll get page 1 over and over again because it won't see the page 2, 3, ect from the params)
    const { searchParams } = new URL(req.url);
    searchParams.forEach((value, key) => {
      if (!source[key]) source[key] = value;
    });
  } else if (method === "GET") {
    const { searchParams } = new URL(req.url);
    searchParams.forEach((value, key) => {
      if (source[key]) {
        if (Array.isArray(source[key])) {
          source[key].push(value);
        } else {
          source[key] = [source[key], value];
        }
      } else {
        source[key] = value;
      }
    });

    // Handle likedIds: support repeated params & CSV
    // Case 1: Already an array of string
    // ["abc", "def"].
    let likedIds = source.likedIds || [];

    if (!Array.isArray(likedIds)) likedIds = [likedIds];

    if (!likedIds.length) {
      // Case 2: support comma-separated fallback like ?likedIds=1,2,3
      // ["abc,def"] (a single string)
      // Normalizes it into the same shape as Case 1
      const likedCsv = searchParams.get("likedIds");

      if (likedCsv) {
        likedIds = likedCsv
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    source.likedIds = likedIds;
  }

  const page = parseInt(source.page) || 1;
  const sortingValue = parseInt(source.sortingvalue) || -1;
  const sortingProperty = source.sortingproperty || "createdAt";
  const tags = source.tags;
  const profileUserId = source.profileUserId;
  const likedIds = source.likedIds;

  let sortLogic = {};
  sortLogic[sortingProperty] = sortingValue;

  let filter = {};

  if (tags?.length) {
    // console.log("tags in swr", tags);
    const tagIds = tags.map((id) => new mongoose.Types.ObjectId(id));
    filter.tags = { $all: tagIds };
    // console.log("tag ids in swr", tagIds);
  }

  if (profileUserId) {
    filter.createdBy = new mongoose.Types.ObjectId(profileUserId);
  }

  if (likedIds?.length) {
    const likedObjectIds = likedIds.map(
      (id) => new mongoose.Types.ObjectId(id),
    );
    filter._id = { $in: likedObjectIds };
  }

  try {
    const totalDocs = await Names.countDocuments(filter);
    const totalPagesInDatabase = Math.ceil(totalDocs / limit);
    // console.log("filter in swr", filter);

    // console.log(
    //   "sortLogic",
    //   sortLogic,
    //   "page",
    //   page,
    //   "skip",
    //   (page - 1) * limit,
    // );

    const names = await Names.aggregate([
      { $match: filter },
      { $sort: sortLogic },
      { $skip: (page - 1) * limit },
      { $limit: limit },

      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      { $unwind: "$createdBy" },

      {
        $lookup: {
          from: "nametags",
          localField: "tags",
          foreignField: "_id",
          as: "tagsLookup",
        },
      },
      {
        $addFields: {
          tags: {
            $map: {
              input: "$tags",
              as: "tagId",
              in: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$tagsLookup",
                      as: "t",
                      cond: { $eq: ["$$t._id", "$$tagId"] },
                    },
                  },
                  0,
                ],
              },
            },
          },
        },
      },

      {
        $project: {
          _id: 1,
          content: 1,
          notes: 1,
          tags: { tag: 1, _id: 1 },
          createdBy: {
            name: 1,
            profileName: 1,
            profileImage: 1,
            _id: 1,
          },
          likedByCount: 1,
          updatedAt: 1,
        },
      },
    ]);

    return Response.json({
      data: names,
      totalPagesInDatabase,
      currentPage: page,
      totalDocs,
    });
  } catch (err) {
    console.error("API error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

// import dbConnect from "@utils/db.js";
// import Names from "@models/Name.js";
// import mongoose from "mongoose";

// export default async function handler(req, res) {
//   await dbConnect.connect();

//   const limit = 50;

//   const method = req.method;
//   const {
//     page = 1,
//     sortingvalue = -1,
//     sortingproperty = "createdAt",
//     tags,
//     profileUserId,
//   } = req.query;
//   //https://stackoverflow.com/questions/70751313/how-can-i-pass-a-variable-in-sort-funtcion-of-mongobd
//   let sortLogic = {};
//   sortLogic[sortingproperty] = parseInt(sortingvalue);

//   // console.log(
//   //   "sortLogic",
//   //   sortLogic,
//   //   "sortingproperty",
//   //   sortingproperty,
//   //   "sortingvalue",
//   //   sortingvalue,
//   // );
//   // console.log("tags", tags);

//   if (method === "DELETE" || method === "PUT") {
//     res.status(405).json({ error: "Method not allowed" });
//   }

//   try {
//     let source;
//     if (method === "POST" && req.body && Object.keys(req.body).length > 0) {
//       source = req.body; // POST with body
//     } else if (method === "GET") {
//       source = req.query; // regular GET
//     } else {
//       source = {}; // POST with empty body → treat as GET
//     }

//     // Merge query (for pagination/sorting) + body (for filters)
//     const { tags, profileUserId, likedIds } = source;

//     console.log("req.body in api", req.body, "req.query in api", req.query);
//     // filtering by tags logic
//     let filter = {};

//     if (tags?.length) {
//       const tagIds = tags.map((id) => new mongoose.Types.ObjectId(id));
//       filter.tags = { $all: tagIds };
//     }

//     // Filter by user ID if provided
//     if (profileUserId) {
//       // Ensure it’s a valid ObjectId
//       filter.createdBy = new mongoose.Types.ObjectId(profileUserId);
//     }

//     if (likedIds?.length) {
//       const likedObjectIds = likedIds.map(
//         (id) => new mongoose.Types.ObjectId(id),
//       );
//       filter._id = { $in: likedObjectIds };
//     }

//     const totalDocs = await Names.countDocuments(filter);
//     const totalPagesInDatabase = Math.ceil(totalDocs / parseInt(limit));

//     const names = await Names.aggregate([
//       // $match is at the top of the aggregation, so it’s efficient. Aka Mongo filters before doing $lookup or pagination
//       { $match: filter },

//       // Pagination
//       { $sort: sortLogic },
//       { $skip: (parseInt(page) - 1) * parseInt(limit) },
//       { $limit: parseInt(limit) },

//       // Lookups
//       {
//         $lookup: {
//           from: "users",
//           localField: "createdBy",
//           foreignField: "_id",
//           as: "createdBy",
//         },
//       },
//       { $unwind: "$createdBy" },

//       {
//         // will fill out the tags data from the objectIds stored in the name, but lookup will reorder the tags
//         $lookup: {
//           from: "nametags",
//           localField: "tags",
//           foreignField: "_id",
//           as: "tagsLookup",
//         },
//       }, // Preserve original order of tags, so users see the tags in the order they added them // so when we mutate() following a name being edited, the newest tags show up at the end
//       {
//         $addFields: {
//           // replacing the tags field with a reordered array based on tagsLookup
//           tags: {
//             $map: {
//               input: "$tags",
//               // we're looking at the original tags array of tag ObjectIds, before it was fleshed out with tags information in the lookup
//               as: "tagId",
//               in: {
//                 // in expression determines what value goes into the new array
//                 $arrayElemAt: [
//                   // arrayElemAt picks the first (and only) element from the filtered array that passes
//                   {
//                     $filter: {
//                       // Filters the $tagsLookup array (the joined full tag documents) for the tag._id that matches the current tagId Object Id
//                       input: "$tagsLookup",
//                       // the fleshed out but reordered tags array from lookup
//                       as: "t",
//                       cond: { $eq: ["$$t._id", "$$tagId"] }, //$$tagId current ObjectId from the original tags array
//                     },
//                   },
//                   0,
//                 ],
//               },
//             },
//           },
//         },
//       },

//       // Final projection
//       {
//         $project: {
//           _id: 1,
//           content: 1,
//           notes: 1,
//           tags: { tag: 1, _id: 1 },
//           createdBy: {
//             name: 1,
//             profileName: 1,
//             profileImage: 1,
//             _id: 1,
//           },
//           likedByCount: 1, // use precomputed field
//           updatedAt: 1,
//           //vital for swr edit to work, its used as part of the content key
//           // the key needs to change, or react won't render the edit updates, so we need a field thats always different, which updatedAt is perfect for
//         },
//       },
//     ]);

//     res.status(200).json({
//       data: names,
//       totalPagesInDatabase,
//       currentPage: parseInt(page),
//       totalDocs,
//     });
//   } catch (err) {
//     console.error("API error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// }
