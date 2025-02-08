import Posts from "../../../models/Post";
import db from "../../../utils/db";

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).send({ message: `${req.method} not supported` });
  }

  const postId = req.body.contentid;

  const flaggedByUser = req.body.flaggedbyuser;

  await db.connect();
  const postContent = await Posts.findById(postId);

  postContent.flaggedby.push(flaggedByUser);

  await postContent.save();

  res.send({
    message: "Flag for post updated",
  });
}

export default handler;
