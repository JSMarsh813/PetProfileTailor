//get request
//filter names so it only includes names which have the userid
//names.filter(name=>name.likedby.includes(userId))

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "../../../../utils/db";
const ObjectId = require("mongodb").ObjectId;
import Users from "../../../../models/User";
//wasn't working when everything was lowercase, had to be IndividualNames not individualNames for it to work

export default async function handler(req, res) {
  const userId = ObjectId(req.query.id);
  const method = req.method;

  dbConnect.connect();

  if (method === "GET") {
    try {
      const user = await Users.findById(userId).select(
        "name followers name profileimage profilename bioblurb location"
      );
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
