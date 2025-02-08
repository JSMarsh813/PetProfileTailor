import ForumComments from "../../../models/BatSignalComment";
import db from "../../../utils/db";

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).send({ message: `${req.method} not supported` });
  }

  const namecommentId = req.body.contentid;

  const flaggedByUser = req.body.flaggedbyuser;

  await db.connect();
  const nameCommentContent = await ForumComments.findById(namecommentId);

  nameCommentContent.flaggedby.push(flaggedByUser);

  await nameCommentContent.save();

  res.send({
    message: "Flag for name comment updated",
  });
}

export default handler;
