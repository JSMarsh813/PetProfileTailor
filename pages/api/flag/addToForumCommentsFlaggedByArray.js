import ForumComments from "../../../models/BatSignalComment";
import db from "../../../utils/db";

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).send({ message: `${req.method} not supported` });
  }

  const forumcommentId = req.body.contentid;

  const flaggedByUser = req.body.flaggedbyuser;

  await db.connect();
  const forumCommentContent = await ForumComments.findById(forumcommentId);

  forumCommentContent.flaggedby.push(flaggedByUser);

  await forumCommentContent.save();

  res.send({
    message: "Flag for forum comment updated",
  });
}

export default handler;
