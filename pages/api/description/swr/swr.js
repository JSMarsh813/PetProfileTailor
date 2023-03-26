import dbConnect from "../../../../config/connectmongodb";
import Description from "../../../../models/description";

export default async function handler(req, res) {
  const method = req.method;
  const { page, limit, sortingvalue, sortingproperty } = req.query;

  let sortlogic = {};
  sortlogic[sortingproperty] = parseInt(sortingvalue);

  dbConnect();

  if (method === "GET") {
    try {
      const descriptionList = await Description.aggregate([
        {
          $project: {
            description: 1,
            notes: 1,
            tags: 1,
            createdby: 1,
            relatednames: 1,
            likedby: 1,
            likedbylength: { $size: "$likedby" },
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
            tags: { tag: 1 },
            createdby: {
              name: 1,
              profilename: 1,
              profileimage: 1,
            },
            likedby: 1,
            relatednames: 1,
            length: { $size: "$likedby" },
          },
        },
      ]);

      res.status(200).json(descriptionList);
    } catch (err) {
      res.status(500).json(`this is an error ${JSON.stringify(err)}`);
    }
  }
}
