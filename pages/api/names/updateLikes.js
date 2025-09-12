import Names from "@models/Names";
import db from "@utils/db";

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const nameId = req.body.currentTargetedId;
  const user = req.body.signedInUsersId;

  await db.connect();
  const toUpdateName = await Names.findById(nameId);

  toUpdateName.likedby.includes(user)
    ? (toUpdateName.likedby = toUpdateName.likedby.filter(
        (userinlikedby) => userinlikedby != user,
      ))
    : (toUpdateName.likedby = toUpdateName.likedby.concat(user));

  await toUpdateName.save();

  res.send({
    message: "Names likes updated",
  });
}

export default handler;
