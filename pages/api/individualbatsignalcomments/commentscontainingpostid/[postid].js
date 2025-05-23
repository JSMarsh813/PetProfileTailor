//get request
//filter names so it only includes names which have the userid
//names.filter(name=>name.likedby.includes(userId))

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "../../../../utils/db";
import User from "../../../../models/User";
import BatSignalComments from "../../../../models/BatSignalComment";
//wasn't working when everything was lowercase, had to be IndividualNames not individualNames for it to work

export default async function handler(req, res) {
  const postid = req.query.postid;
  const method = req.method;

  await dbConnect.connect();

  {
    console.log(`this is in comments containing post id ${postid}`);
  }
  if (method === "GET") {
    try {
      const batSignalComments = await BatSignalComments.find({
        replyingtothisid: postid,
      }).populate({
        path: "createdby",
        select: ["name", "profilename", "profileimage"],
      });
      res.status(200).json(batSignalComments);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}
