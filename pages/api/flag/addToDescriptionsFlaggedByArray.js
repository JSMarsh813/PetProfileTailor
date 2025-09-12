import Descriptions from "@models/description";
import db from "@utils/db";

async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).send({ message: `${req.method} not supported` });
  }

  const descriptionId = req.body.contentid;

  const flaggedByUser = req.body.flaggedbyuser;

  await db.connect();
  const descriptionContent = await Descriptions.findById(descriptionId);

  descriptionContent.flaggedby.push(flaggedByUser);

  await descriptionContent.save();

  res.send({
    message: "Flag for description updated",
  });
}

export default handler;
