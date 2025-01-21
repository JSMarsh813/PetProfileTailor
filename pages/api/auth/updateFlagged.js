import Names from "../../../models/Names";
import db from "../../../utils/db";

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const nameId = req.body.currentTargetedId;
  const user = req.body.session.user._id;

  await db.connect();
  const toUpdateName = await Names.findById(nameId);

  toUpdateName.flaggedby.includes(user)
    ? (toUpdateName.flaggedby = toUpdateName.flaggedby.filter(
        (userinflaggedby) => userinflaggedby != user,
      ))
    : (toUpdateName.flaggedby = toUpdateName.flaggedby.concat(user));

  await toUpdateName.save();

  res.send({
    message: "Flag for name updated",
  });
}

export default handler;
