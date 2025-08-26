import dbConnect from "../../../../utils/db.js";
import Names from "../../../../models/Names.js";

export default async function handler(req, res) {
  const method = req.method;
  const {
    page = 1,
    limit = 10,
    sortingvalue = -1,
    sortingproperty = "createdAt",
    tags,
  } = req.query;
  //https://stackoverflow.com/questions/70751313/how-can-i-pass-a-variable-in-sort-funtcion-of-mongobd
  let sortLogic = {};
  sortLogic[sortingproperty] = parseInt(sortingvalue);

  await dbConnect.connect();

  if (method === "GET") {
    try {
      // Build filter for tags (optional)
      let filter = {};
      if (tags) {
        // Expect tags as a comma-separated string of ObjectId strings
        const tagIds = tags.split(",");
        filter.tags = { $in: tagIds };
      }

      const individualNames = await Names.aggregate([
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
          $lookup: {
            from: "namecomments",
            localField: "comments",
            foreignField: "_id",
            as: "namecomments",
          },
        },
        {
          $lookup: {
            from: "nametags",
            localField: "tags",
            foreignField: "_id",
            as: "tags",
          },
        },

        // Final projection
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            tags: { tag: 1, _id: 1 },
            comments: 1,
            createdby: {
              name: 1,
              profilename: 1,
              profileimage: 1,
              _id: 1,
            },
            likedby: 1,
            likedbylength: 1, // use precomputed field
            flaggedby: 1,
          },
        },
      ]);

      res.status(200).json(individualNames);
    } catch (err) {
      console.error("API error:", err);
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
