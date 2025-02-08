import Users from "../../../models/User";
import db from "../../../utils/db";

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).send({ message: `${req.method} not supported` });
  }

  const userId = req.body.contentid;

  const flaggedByUser = req.body.flaggedbyuser;

  await db.connect();
  const userContent = await Users.findById(userId);

  userContent.flaggedby.push(flaggedByUser);

  await userContent.save();

  res.send({
    message: "Flag for user updated",
  });
}

export default handler;
