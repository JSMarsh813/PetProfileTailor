import db from "@utils/db";
import Report from "@/models/Report";
import mongoose from "mongoose";
import { leanWithStrings } from "@/utils/mongoDataCleanup";

export default async function handler(req, res) {
  await db.connect();

  const userId = session.user.id;

  if (req.method === "GET") {
    try {
      const { contentId, status } = req.query;
      await db.connect();

      const report = await leanWithStrings(
        Report.findOne(
          {
            contentId: contentId,
            reportedBy: userId,
            status,
          },
          {
            reportCategories: 1,
            comments: 1,
            reportedBy: 1,
            contentCreatedBy: 1,
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
      const { reportId, reportCategories, comments } = req.body;

      const existingReport = await Report.findById(reportId);

      if (!existingReport) {
        return res.status(404).json({ error: "Report not found" });
      }

      if (existingReport.reportedby.toString() !== userId) {
        return res.status(403).json({
          error: "You are not authorized to update this report",
        });
      }

      existingReport.reportCategories = reportCategories;
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
      const { reportId } = req.body;

      if (!userId) {
        return res.status(403).json({
          error: "You must be signed in to delete a report",
        });
      }

      const reportToUpdate = await Report.findOneAndUpdate(
        { _id: reportId, reportedBy: userId },
        { status: "deleted", outcome: "deletedByUser" },
        { new: true },
      );

      if (!reportToUpdate) {
        return res.status(404).json({
          error:
            "Report not found or you are not authorized to delete this document, because you are not the reporter",
        });
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
