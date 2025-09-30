// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import db from "@utils/db";
import Report from "@models/Report";
import { getSessionForApis } from "@/utils/api/getSessionForApis";

//wasn't working when everything was lowercase, had to be IndividualPosts not individualNames for it to work

export default async function handler(req, res) {
  const { method } = req;

  const { ok, session } = await getSessionForApis({
    req,
    res,
  });
  if (!ok) {
    return;
  }

  const reportedByUserId = session.user.id;

  await db.connect();

  if (method === "GET") {
    res.status(404);
  }

  if (method === "PUT") {
    res.status(404);
  }

  if (method === "POST") {
    const {
      contentType,
      contentId,
      contentCopy,
      contentCreatedBy,
      reportCategories,
      comments,
    } = req.body;

    if (contentCreatedBy === reportedByUserId) {
      res.status(201).send({
        report: req.body,
        message: `You cannot flag your own content`,
      });
    }

    const existingReport = await Report.findOne({
      reportedBy: reportedByUserId,
      contentId,
      status: { $nin: ["dismissed", "deleted", "resolved"] },
    });

    if (existingReport) {
      res.status(201).send({
        report: existingReport,
        message: `You cannot flag this content again until the review process is completed for your current report`,
      });
    }
    try {
      const report = await Report.create({
        contentType,
        contentId,
        contentCopy,
        contentCreatedBy,
        reportedBy: reportedByUserId,
        reportCategories,
        comments,
      });
      res.status(201).send({
        report,
        message: `Report successfully submitted, thank you!`,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: `Report not submitted. There was an error!`,
      });
    }
  }

  if (method === "DELETE") {
    res.status(404);
  }
}
