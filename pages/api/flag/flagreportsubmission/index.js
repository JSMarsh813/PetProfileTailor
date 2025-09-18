// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import db from "@utils/db";
import FlagReport from "@models/FlagReport";
import { getServerSession } from "next-auth/next";
import { serverAuthOptions } from "@/lib/auth";

//wasn't working when everything was lowercase, had to be IndividualPosts not individualNames for it to work

export default async function handler(req, res) {
  const { method } = req;

  const session = await getServerSession(req, res, serverAuthOptions);

  if (!session) {
    res.status(401).json({ message: "Not authenticated" });
    return null;
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
    if (!session) {
      res.status(401).json({ message: "Not authenticated" });
      return null;
    }

    const {
      contenttype,
      contentid,
      contentcopy,
      contentcreatedby,
      reportcategories,
      comments,
    } = req.body;

    if (contentcreatedby === reportedByUserId) {
      res.status(201).send({
        report,
        message: `You cannot flag your own content`,
      });
    }

    const existingReport = await FlagReport.findOne({
      reportedby: reportedByUserId,
      contentid,
      status: { $nin: ["dismissed", "deleted", "resolved"] },
    });

    if (existingReport) {
      res.status(201).send({
        report,
        message: `You cannot flag this content again until the review process is completed for your current report`,
      });
    }
    try {
      const report = await FlagReport.create({
        contenttype,
        contentid,
        contentcopy,
        contentcreatedby,
        reportedby: reportedByUserId,
        reportcategories,
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
