import db from "../../../../utils/db";
import FlagReport from "@/models/FlagReport";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await db.connect();

  if (req.method === "GET") {
    try {
      const { contentId, userId } = req.query;
      await db.connect();

      const report = await FlagReport.findOne(
        { contentid: contentId, flaggedbyuser: userId },
        {
          reportcategories: 1,
          comments: 1,
          flaggedby: 1,
          contentcreatedby: 1,
          _id: 1,
          status: 1,
        },
      ).lean(); //.lean() makes the query faster by returning plain JS objects.

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

      const updatedReport = await FlagReport.findByIdAndUpdate(
        reportid, // don’t need to use _id: reportid inside findByIdAndUpdate, because that method specifically expects the id value directly, not an object.
        {
          reportcategories,
          comments,
        },
        { new: true }, // return updated doc
      ).lean();

      if (!updatedReport) {
        return res.status(404).json({ error: "Report not found" });
      }

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
      const { reportid, userid } = req.body;

      const reportToUpdate = await FlagReport.findOneAndUpdate(
        { _id: reportid, reportedby: userid },
        { status: "deleted" },
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
