import db from "@utils/db";
import FlagReport from "@/models/FlagReport";
import mongoose from "mongoose";
import { leanWithStrings } from "@/utils/mongoDataCleanup";
import { checkOwnership } from "@/utils/auth/checkOwnership";

export default async function handler(req, res) {
  await db.connect();

  const session = await checkOwnership({
    req,
    res,
    resourceCreatorId: toUpdateDescription.createdby,
  });
  if (!session) return;

  const userId = session.user.id;

  if (req.method === "GET") {
    try {
      const { contentId, status } = req.query;
      await db.connect();

      const report = await leanWithStrings(
        FlagReport.findOne(
          {
            contentid: contentId,
            flaggedbyuser: userId,
            status,
          },
          {
            reportcategories: 1,
            comments: 1,
            flaggedby: 1,
            contentcreatedby: 1,
            _id: 1,
            status: 1,
          },
        ).sort({ createdAt: -1 }), //failsafe, in case somehow theres 2 active reports due to some glitch, grab the most recent one
      );
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }

      res.status(200).json({ report });
    } catch (err) {
      console.error("API error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }

  if (req.method === "PUT") {
    try {
      const { reportid, reportcategories, comments } = req.body;

      const existingReport = await FlagReport.findById(reportid);

      if (!existingReport) {
        return res.status(404).json({ error: "Report not found" });
      }

      if (existingReport.reportedby.toString() !== userId) {
        return res.status(403).json({
          error: "You are not authorized to update this report",
        });
      }

      existingReport.reportcategories = reportcategories;
      existingReport.comments = comments;

      const updatedReport = await existingReport.save();

      return res
        .status(200)
        .json({ message: "Report updated successfully", updatedReport });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { reportid } = req.body;

      const reportToUpdate = await FlagReport.findOneAndUpdate(
        { _id: reportid, reportedby: userId },
        { status: "deleted", outcome: "report_deleted_by_reporter" },
        { new: true },
      );

      if (!reportToUpdate) {
        return res.status(404).json({ error: "Report not found" });
      }

      return res
        .status(200)
        .json({ message: "Report marked as deleted", report: reportToUpdate });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
