import dbConnect from "../../../../config/connectmongodb";
import Posts from "../../../../models/posts";
import Users from "../../../../models/User";

export default async function handler(req, res) {
  const method = req.method;
  const { page, limit, sortingvalue, sortingproperty } = req.query;

  let sortlogic = {};
  sortlogic[sortingproperty] = parseInt(sortingvalue);

  dbConnect();

  if (method === "GET") {
    try {
      const postList = await Posts.aggregate([
        {
          $project: {
            _id: 1,
            image: 1,
            title: 1,
            description: 1,
            createdby: 1,
            taglist: 1,
            likedby: 1,
            likedbylength: { $size: "$likedby" },
            alttext: 1,
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
          $project: {
            image: 1,
            title: 1,
            description: 1,
            createdby: {
              _id: 1,
              name: 1,
              profilename: 1,
              profileimage: 1,
            },
            taglist: 1,
            likedby: 1,
            length: { $size: "$likedby" },
            alttext: 1,
          },
        },
      ]);

      res.status(200).json(postList);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
