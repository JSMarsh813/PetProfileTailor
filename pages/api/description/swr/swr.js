import dbConnect from "@utils/db";
import Description from "@/models/Description";

export default async function handler(req, res) {
  const method = req.method;
  const {
    page = 1,
    sortingvalue = -1,
    sortingproperty = "createdAt",
    tags,
  } = req.query;
  //https://stackoverflow.com/questions/70751313/how-can-i-pass-a-variable-in-sort-funtcion-of-mongobd

  let sortLogic = {};
  sortLogic[sortingproperty] = parseInt(sortingvalue);

  await dbConnect.connect();

  console.log(
    "sortLogic",
    sortLogic,
    "sortingproperty",
    sortingproperty,
    "sortingvalue",
    sortingvalue,
  );
  const limit = 50;
  console.log("tags", tags);

  if (method === "GET") {
    try {
      // filtering by tags logic
      let filter = {};
      if (tags) {
        // Expect tags as a comma-separated string of ObjectId strings
        const tagIds = tags
          .split(",")
          .map((id) => new mongoose.Types.ObjectId(id));
        filter.tags = { $all: tagIds };
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
      console.log("error in db", err);
      res.status(500).json(`this is an error ${JSON.stringify(err)}`);
    }
  }
}
