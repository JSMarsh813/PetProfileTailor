import dbConnect from "@utils/db";
import Description from "@models/description";

export default async function handler(req, res) {
  const method = req.method;
  const { page, limit, sortingvalue, sortingproperty } = req.query;

  let sortlogic = {};
  sortlogic[sortingproperty] = parseInt(sortingvalue);

  await dbConnect.connect();

  if (method === "GET") {
    try {
      const descriptionList = await Description.aggregate([
        {
          $project: {
            _id: 1,
            description: 1,
            notes: 1,
            tags: 1,
            createdby: 1,
            relatednames: 1,
            likedby: 1,
            likedbylength: { $size: "$likedby" },
            flaggedby: 1,
          },
        },
        { $sort: sortlogic },
        { $skip: parseInt((page - 1) * limit) },
        { $limit: parseInt(limit) },
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
            from: "descriptiontags",
            localField: "tags",
            foreignField: "_id",
            as: "tags",
          },
        },
        {
          $project: {
            description: 1,
            notes: 1,
            tags: { tag: 1, _id: 1 },
            createdby: {
              _id: 1,
              name: 1,
              profilename: 1,
              profileimage: 1,
            },
            likedby: 1,
            relatednames: 1,
            length: { $size: "$likedby" },
            flaggedby: 1,
          },
        },
      ]);

      res.status(200).json(descriptionList);
    } catch (err) {
      res.status(500).json(`this is an error ${JSON.stringify(err)}`);
    }
  }
}
