import dbConnect from "../../../../config/connectmongodb";
import Names from "../../../../models/Names";

export default async function handler(req, res) {
  const method = req.method;
  const { page, limit, sortingvalue, sortingproperty } = req.query;
  //https://stackoverflow.com/questions/70751313/how-can-i-pass-a-variable-in-sort-funtcion-of-mongobd
  let sortlogic = {};
  sortlogic[sortingproperty] = parseInt(sortingvalue);

  dbConnect();

  if (method === "GET") {
    try {
      const individualNames = await Names.aggregate([
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            tags: 1,
            comments: 1,
            createdby: 1,
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
            from: "nametags",
            localField: "tags",
            foreignField: "_id",
            as: "tags",
          },
        },
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
            length: { $size: "$likedby" },
          },
        },
      ]);

      res.status(200).json(individualNames);
    } catch (err) {
      res.status(500).json(err);
      console.log(`this is an error ${JSON.stringify(err)}`);
    }
  }
}
