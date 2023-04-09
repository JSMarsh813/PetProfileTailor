//get request
//filter names so it only includes names which have the userid
//names.filter(name=>name.likedby.includes(userId))

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "../../../../utils/db";
import User from "../../../../models/User";
import NameComments from "../../../../models/namecomment";
export default async function handler(req, res) {
  const nameid = req.query.nameid;
  const method = req.method;

  dbConnect.connect();

  if (method === "GET") {
    try {
      const nameComments = await NameComments.find({
        replyingtothisid: nameid,
      }).populate({
        path: "createdby",
        select: ["name", "profilename", "profileimage"],
      });
      res.status(200).json(nameComments);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
