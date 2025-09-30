// app/api/description/swr/route.js
import dbConnect from "@utils/db";
import Description from "@/models/Description";
import mongoose from "mongoose";

const LIMIT = 50;

async function buildSourceFromSearchParams(searchParams) {
  // Build the same shape as the old req.query would have produced
  const tags = searchParams.getAll("tags") || [];

  // for if we're only returning items the user liked, for the dashboard SWR
  let likedIds = searchParams.getAll("likedIds") || [];
  // Case 1: Already an array of string
  // ["abc", "def"].

  // Case 2: support comma-separated fallback like ?likedIds=1,2,3
  // ["abc,def"] (a single string)
  // Normalizes it into the same shape as Case 1
  if (!likedIds.length) {
    const likedCsv = searchParams.get("likedIds");
    if (likedCsv)
      likedIds = likedCsv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
  }
  // Filter by user ID if provided
  const profileUserId = searchParams.get("profileUserId") || undefined;

  const source = {};
  if (tags.length) source.tags = tags;
  if (profileUserId) source.profileUserId = profileUserId;
  if (likedIds.length) source.likedIds = likedIds;

  return source;
}

async function runAggregation({ req, source }) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const sortingvalue = parseInt(searchParams.get("sortingvalue") || "-1", 10);
  const sortingproperty = searchParams.get("sortingproperty") || "createdAt";

  const limit = LIMIT;
  const sortLogic = {};
  sortLogic[sortingproperty] = sortingvalue;

  // If no source provided (POST with empty body or GET), build it from search params
  if (!source || Object.keys(source).length === 0) {
    source = await buildSourceFromSearchParams(searchParams);
  }

  const { tags, profileUserId, likedIds } = source || {};

  // Build filter
  const filter = {};
  if (tags?.length) {
    const tagIds = tags.map((id) => new mongoose.Types.ObjectId(id));
    filter.tags = { $all: tagIds };
  }

  if (profileUserId) {
    // Ensure it’s a valid ObjectId
    filter.createdBy = new mongoose.Types.ObjectId(profileUserId);
  }

  if (likedIds?.length) {
    const likedObjectIds = likedIds.map(
      (id) => new mongoose.Types.ObjectId(id),
    );
    filter._id = { $in: likedObjectIds };
  }

  const totalDocs = await Description.countDocuments(filter);
  const totalPagesInDatabase = Math.ceil(totalDocs / parseInt(limit, 10));

  const descriptions = await Description.aggregate([
    { $match: filter },

    // Pagination + sort
    { $sort: sortLogic },
    { $skip: (page - 1) * parseInt(limit, 10) },
    { $limit: parseInt(limit, 10) },

    // Lookups
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
        from: "descriptiontags",
        localField: "tags",
        foreignField: "_id",
        as: "tagsLookup",
      },
    },

    // Preserve original tag order by mapping original tag ids to their full docs
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
        tags: 1,
        createdBy: 1,
        likedByCount: 1,
        updatedAt: 1,
      },
    },

    // Final projection (keep shape identical to original)
    {
      $project: {
        content: 1,
        notes: 1,
        tags: { tag: 1, _id: 1 },
        createdBy: {
          _id: 1,
          name: 1,
          profileName: 1,
          profileImage: 1,
        },
        likedByCount: 1,
        updatedAt: 1,
      },
    },
  ]);

  return {
    descriptions,
    totalPagesInDatabase,
    currentPage: page,
    totalDocs,
  };
}

/* GET handler - reads filters from querystring */
export async function GET(req) {
  try {
    await dbConnect.connect();

    // For GET, we treat everything as coming from the URL search params
    const result = await runAggregation({ req, source: null });
    return Response.json({
      data: result.descriptions,
      totalPagesInDatabase: result.totalPagesInDatabase,
      currentPage: result.currentPage,
      totalDocs: result.totalDocs,
    });
  } catch (err) {
    console.error("API error (GET):", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

/* POST handler - if body present, use body for filters; otherwise fall back to querystring */
export async function POST(req) {
  try {
    await dbConnect.connect();

    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      // empty body or invalid JSON -> treat as empty
      body = {};
    }

    const source = body && Object.keys(body).length > 0 ? body : null;
    const result = await runAggregation({ req, source });

    return Response.json({
      data: result.descriptions,
      totalPagesInDatabase: result.totalPagesInDatabase,
      currentPage: result.currentPage,
      totalDocs: result.totalDocs,
    });
  } catch (err) {
    console.error("API error (POST):", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

/* Explicitly disallow PUT / DELETE (mirrors your original behavior) */
export function PUT() {
  return new Response("Method Not Allowed", { status: 405 });
}
export function DELETE() {
  return new Response("Method Not Allowed", { status: 405 });
}

// import dbConnect from "@utils/db";
// import Description from "@/models/Description";
// import mongoose from "mongoose";

// export default async function handler(req, res) {
//   await dbConnect.connect();

//   const limit = 50;

//   const method = req.method;
//   const {
//     page = 1,
//     sortingvalue = -1,
//     sortingproperty = "createdAt",
//   } = req.query;
//   //https://stackoverflow.com/questions/70751313/how-can-i-pass-a-variable-in-sort-funtcion-of-mongobd

//   let sortLogic = {};
//   sortLogic[sortingproperty] = parseInt(sortingvalue);

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

//     const totalDocs = await Description.countDocuments(filter);
//     const totalPagesInDatabase = Math.ceil(totalDocs / parseInt(limit));

//     const descriptions = await Description.aggregate([
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
//           from: "descriptiontags",
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
//       {
//         $project: {
//           _id: 1,
//           content: 1,
//           notes: 1,
//           tags: 1,
//           createdBy: 1,
//           likedByCount: 1,
//           updatedAt: 1,
//         },
//       },
//       // Final projection
//       {
//         $project: {
//           content: 1,
//           notes: 1,
//           tags: { tag: 1, _id: 1 },
//           createdBy: {
//             _id: 1,
//             name: 1,
//             profileName: 1,
//             profileImage: 1,
//           },
//           likedByCount: 1,
//           updatedAt: 1,
//           //vital for swr edit to work, its used as part of the content key
//           // the key needs to change, or react won't render the edit updates, so we need a field thats always different, which updatedAt is perfect for
//         },
//       },
//     ]);

//     res.status(200).json({
//       data: descriptions,
//       totalPagesInDatabase,
//       currentPage: parseInt(page),
//       totalDocs,
//     });
//   } catch (err) {
//     console.error("API error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// }
