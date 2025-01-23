import Names from "../../../models/Names";
import db from "../../../utils/db";

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).send({ message: `${req.method} not supported` });
  }

  const nameId = req.body.contentid;

  const flaggedByUser = req.body.flaggedbyuser;

  await db.connect();
  const nameContent = await Names.findById(nameId);

  nameContent.flaggedby.concat(...flaggedByUser);

  await nameContent.save();

  res.send({
    message: "Flag for name updated",
  });
}

export default handler;
