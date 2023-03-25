import dbConnect from "../../../../config/connectmongodb";
import Names from "../../../../models/Names";
import Users from "../../../../models/User";
import Tags from "../../../../models/NameTag";
export default async function handler(req, res) {
  const method = req.method;
  const { page, limit, sortinglogicstring } = req.query;
  // let skipvalue = parseInt((page - 1) * limit);
  // let limitvalue = parseInt(limit);

  //https://stackoverflow.com/questions/70751313/how-can-i-pass-a-variable-in-sort-funtcion-of-mongobd
  // let sortlogic = {};
  // let test = sortinglogicstring.split(",");
  // let sortproperty = test[0];
  // let sortvalue = parseInt(test[1]);

  sortlogic[sortproperty] = sortvalue;

  if (method === "GET") {
    try {
      const individualNames = await Names.aggregate([
        {
          $project: {
            name: 1,
            description: 1,
            tags: 1,
            comments: 1,
            createdby: 1,
            likedby: 1,
            likedbylength: { $size: "$likedby" },
          },
        },
        // { $sort: sortlogic },
        { $skip: skipvalue },
        { $limit: limitvalue },
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
            name: 1,
            description: 1,
            tags: { tag: 1 },
            comments: 1,
            createdby: {
              name: 1,
              profilename: 1,
              profileimage: 1,
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
