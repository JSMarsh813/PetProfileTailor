import db from "@utils/db";
import Thanks from "@/models/Thanks";
import mongoose from "mongoose";
import { leanWithStrings } from "@/utils/mongoDataCleanup";
import { getSessionForApis } from "@/utils/api/getSessionForApis";
import { checkIfValidContentType } from "@/utils/api/CheckIfValidContentType";

export default async function handler(req, res) {
  const { method } = req;

  await db.connect();

  const session = await getSessionForApis({ req, res });
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const userId = session.user.id;

  // ---------------- POST (create a thank you) ----------------
  if (method === "POST") {
    const { contentType, contentCreator, contentId, messages } = req.body;

    if (!contentType || !contentId || !contentCreator || !messages) {
      return res
        .status(400)
        .json({
          error:
            "Missing required paramater of one of those types: contentType, contentId, contentCreator, messages",
        });
    }

    console.log("req.body for thanks", req.body);

    if (contentCreator === userId) {
      return res.status(400).json({
        message:
          "Nice try! But you cannot add a thank you note to your own content 😉",
      });
    }

    checkIfValidContentType(contentType);

    const nameOrDesciptionId =
      contentType === "names" ? "nameId" : "descriptionId";

    const result = await Thanks.find({
      thanksBy: userId,
      [nameOrDesciptionId]: contentId,
    });
    const existingThanksCount = result.length;

    if (existingThanksCount >= 10) {
      return res.status(400).json({
        message:
          "You have reached the maximum thank you notes for this content",
      });
    }

    try {
      const thanks = await Thanks.create({
        contentType,
        contentCreator,
        thanksBy: userId,
        messages,
      });

      if (contentType === "names") thanksData.nameId = contentId;
      else if (contentType === "descriptions")
        thanksData.descriptionId = contentId;

      return res.status(201).json({
        thanks,
        message: "Thanks successfully submitted, thank you!",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // ---------------- GET (fetch thanks) ----------------
  if (method === "GET") {
    try {
      const { contentType, contentId } = req.query;

      if (!contentType || !contentId) {
        return res
          .status(400)
          .json({ error: "Missing contentType or contentId" });
      }

      checkIfValidContentType(contentType);

      const nameOrDesciptionId =
        contentType === "names" ? "nameId" : "descriptionId";

      const thanks = await leanWithStrings(
        Thanks.findOne({
          [nameOrDesciptionId]: contentId,
          thanksBy: userId,
        })
          .sort({ createdAt: -1 })
          .populate({ path: "contentCreator", select: ["name", "profilename"] })
          .populate({ path: "thanksBy", select: ["name", "profilename"] })
          .populate({ path: "nameId", select: ["content"] })
          .populate({ path: "descriptionId", select: ["content"] }),
      );

      if (!thanks) {
        return res.status(404).json({ error: "Thanks not found" });
      }

      return res.status(200).json({ thanks });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
