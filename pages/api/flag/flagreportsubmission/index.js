// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import db from "@utils/db";
import FlagReport from "@models/FlagReport";

//wasn't working when everything was lowercase, had to be IndividualPosts not individualNames for it to work

export default async function handler(req, res) {
  const { method } = req;

  await db.connect();

  if (method === "GET") {
    res.status(404);
  }

  if (method === "PUT") {
    res.status(404);
  }

  if (method === "POST") {
    const {
      contenttype,
      contentid,
      contentcopy,
      createdbyuser,
      flaggedbyuser,
      flagcategories,
      reportcomments,
    } = req.body;

    try {
      const report = await FlagReport.create(req.body);
      res.status(201).send({
        message: `Report for ${contentcopy.name} successfully submitted, thank you!`,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: `Report for ${contentcopy.name} not submitted ${err} !`,
      });
    }
  }

  if (method === "DELETE") {
    res.status(404);
  }
}
