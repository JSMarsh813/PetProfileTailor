import dbConnect from "../../../../config/connectmongodb";
import Posts from "../../../../models/posts";
//wasn't working when everything was lowercase, had to be IndividualNames not individualNames for it to work

export default async function handler(req, res) {
  const method = req.method;
  const { page, limit } = req.query;
  console.log(`this is page ${page} with this many items ${limit}`);
  dbConnect(); //from config/mongo.js

  if (method === "GET") {
    try {
      const postList = await Posts.find()
        .sort({ _id: -1 })
        //this way we get the most recent posts first, we use id since mongoDB's objectID has a 4 byte timestamp naturally built in
        .skip((page - 1) * limit)
        // page 0 * 10 items = 0
        // so no items skipped for page "0"

        //ex: page 1, has 10 items (limit). So it will skip page 1s's 10 items
        .limit(limit)
        //how many items per page
        .populate({
          path: "createdby",
          select: ["name", "profilename", "profileimage"],
        });

      res.status(200).json(postList);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
