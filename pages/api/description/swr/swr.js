import dbConnect from "@utils/db";
import Description from "@/models/Description";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await dbConnect.connect();

  const limit = 50;

  const method = req.method;
  const {
    page = 1,
    sortingvalue = -1,
    sortingproperty = "createdAt",
  } = req.query;
  //https://stackoverflow.com/questions/70751313/how-can-i-pass-a-variable-in-sort-funtcion-of-mongobd

  let sortLogic = {};
  sortLogic[sortingproperty] = parseInt(sortingvalue);

  // console.log(
  //   "sortLogic",
  //   sortLogic,
  //   "sortingproperty",
  //   sortingproperty,
  //   "sortingvalue",
  //   sortingvalue,
  // );

  // console.log("tags", tags);

  if (method === "DELETE" || method === "PUT") {
    res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let source;
    if (method === "POST" && req.body && Object.keys(req.body).length > 0) {
      source = req.body; // POST with body
    } else if (method === "GET") {
      source = req.query; // regular GET
    } else {
      source = {}; // POST with empty body → treat as GET
    }

    // Merge query (for pagination/sorting) + body (for filters)
    const { tags, profileUserId, likedIds } = source;

    // filtering by tags logic
    let filter = {};

    if (tags?.length) {
      const tagIds = tags.map((id) => new mongoose.Types.ObjectId(id));
      filter.tags = { $all: tagIds };
    }

    // Filter by user ID if provided
    if (profileUserId) {
      // Ensure it’s a valid ObjectId
      filter.createdby = new mongoose.Types.ObjectId(profileUserId);
    }

    if (likedIds?.length) {
      const likedObjectIds = likedIds.map(
        (id) => new mongoose.Types.ObjectId(id),
      );
      filter._id = { $in: likedObjectIds };
    }

    const totalDocs = await Description.countDocuments(filter);
    const totalPagesInDatabase = Math.ceil(totalDocs / parseInt(limit));

    const descriptions = await Description.aggregate([
      { $match: filter },

      // Pagination
      { $sort: sortLogic },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },

      // Lookups
      {
        $lookup: {
          from: "users",
          localField: "createdby",
          foreignField: "_id",
          as: "createdby",
        },
      },
      { $unwind: "$createdby" },
      {
        // will fill out the tags data from the objectIds stored in the name, but lookup will reorder the tags
        $lookup: {
          from: "descriptiontags",
          localField: "tags",
          foreignField: "_id",
          as: "tagsLookup",
        },
      }, // Preserve original order of tags, so users see the tags in the order they added them // so when we mutate() following a name being edited, the newest tags show up at the end
      {
        $addFields: {
          // replacing the tags field with a reordered array based on tagsLookup
          tags: {
            $map: {
              input: "$tags",
              // we're looking at the original tags array of tag ObjectIds, before it was fleshed out with tags information in the lookup
              as: "tagId",
              in: {
                // in expression determines what value goes into the new array
                $arrayElemAt: [
                  // arrayElemAt picks the first (and only) element from the filtered array that passes
                  {
                    $filter: {
                      // Filters the $tagsLookup array (the joined full tag documents) for the tag._id that matches the current tagId Object Id
                      input: "$tagsLookup",
                      // the fleshed out but reordered tags array from lookup
                      as: "t",
                      cond: { $eq: ["$$t._id", "$$tagId"] }, //$$tagId current ObjectId from the original tags array
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
          createdby: 1,
          relatednames: 1,
          likedbycount: 1,
          updatedAt: 1,
        },
      },
      // Final projection
      {
        $project: {
          content: 1,
          notes: 1,
          tags: { tag: 1, _id: 1 },
          createdby: {
            _id: 1,
            name: 1,
            profilename: 1,
            profileimage: 1,
          },
          relatednames: 1,
          likedbycount: 1,
          updatedAt: 1,
          //vital for swr edit to work, its used as part of the content key
          // the key needs to change, or react won't render the edit updates, so we need a field thats always different, which updatedAt is perfect for
        },
      },
    ]);

    res.status(200).json({
      data: descriptions,
      totalPagesInDatabase,
      currentPage: parseInt(page),
      totalDocs,
    });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
