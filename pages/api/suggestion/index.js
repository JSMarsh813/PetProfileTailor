import db from "@utils/db";
import Suggestion from "@/models/Suggestion";
import mongoose from "mongoose";
import { leanWithStrings } from "@/utils/mongoDataCleanup";
import { getSessionForApis } from "@/utils/api/getSessionForApis";
import { checkOwnership } from "@/utils/api/checkOwnership";
import convertStringToMongooseId from "@/utils/api/convertStringToMongooseId";

export default async function handler(req, res) {
  const { method } = req;

  await db.connect();

  // Get session (authentication)
  const { ok, session } = await getSessionForApis({ req, res });
  if (!ok) {
    return;
  }

  const userId = session.user.id;

  // ---------------- POST (create a suggestion) ----------------
  if (method === "POST") {
    const {
      contentType,
      contentId,
      contentCreator,
      incorrectTags,
      comments,
      description,
      tags,
    } = req.body;

    console.log("req.body for suggestions", req.body);

    if (contentCreator === userId) {
      return res.status(400).json({
        message: "You cannot add a suggestion to your own content",
      });
    }

    const existingSuggestion = await Suggestion.findOne({
      suggestionBy: userId,
      contentId,
      status: { $nin: ["dismissed", "deleted", "resolved"] },
    });

    if (existingSuggestion) {
      return res.status(400).json({
        message:
          "You cannot add a suggestion to this content again until the current suggestion is resolved",
      });
    }

    try {
      const nameTagsSuggested = contentType === "names" ? tags : [];
      const descriptionTagsSuggested =
        contentType === "description" ? tags : [];

      const incorrectNameTags = contentType === "names" ? incorrectTags : [];
      const incorrectDescriptionTags =
        contentType === "description" ? incorrectTags : [];

      const suggestion = await Suggestion.create({
        contentType,
        contentId,
        contentCreator,
        suggestionBy: userId,
        incorrectNameTags: convertStringToMongooseId(incorrectNameTags),
        incorrectDescriptionTags: convertStringToMongooseId(
          incorrectDescriptionTags,
        ),
        description,
        comments,
        nameTagsSuggested,
        descriptionTagsSuggested,
      });

      return res.status(201).json({
        suggestion,
        message: "Suggestion successfully submitted, thank you!",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // ---------------- GET (fetch suggestion) ----------------
  if (method === "GET") {
    try {
      const { contentId, status } = req.query;

      const suggestion = await leanWithStrings(
        Suggestion.findOne({
          contentId: contentId,
          suggestionBy: userId,
          ...(status && { status }),
        })
          .sort({ createdAt: -1 })
          .populate({ path: "nameTagsSuggested", select: ["tag"] })
          .populate({ path: "descriptionTagsSuggested", select: ["tag"] }),
      );

      if (!suggestion) {
        return res.status(404).json({ error: "Suggestion not found" });
      }

      return res.status(200).json({ suggestion });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  // ---------------- PUT (update suggestion) ----------------
  if (method === "PUT") {
    try {
      const {
        contentType,
        contentId,
        suggestionId,
        incorrectTags,
        description,
        tags,
        comments,
      } = req.body;

      console.log("put request body", req.body);

      const existingSuggestion = await Suggestion.findById(suggestionId);

      if (!existingSuggestion)
        return res.status(404).json({ error: "Suggestion not found" });

      const { ok } = await checkOwnership({
        req,
        res,
        resourceCreatorId: existingSuggestion.suggestionBy.toString(),
      });
      if (!ok) {
        return;
      }

      const nameTagsSuggested =
        existingSuggestion.contentType === "names" ? tags : [];
      const descriptionTagsSuggested =
        existingSuggestion.contentType === "description" ? tags : [];

      const incorrectNameTags = contentType === "names" ? incorrectTags : [];
      const incorrectDescriptionTags =
        contentType === "description" ? incorrectTags : [];

      existingSuggestion.comments = comments;
      existingSuggestion.description = description;

      existingSuggestion.nameTagsSuggested = nameTagsSuggested;
      existingSuggestion.descriptionTagsSuggested = descriptionTagsSuggested;

      existingSuggestion.incorrectNameTags =
        convertStringToMongooseId(incorrectNameTags);
      existingSuggestion.incorrectDescriptionTags = convertStringToMongooseId(
        incorrectDescriptionTags,
      );

      const updatedSuggestion = await existingSuggestion.save();

      return res
        .status(200)
        .json({ message: "Suggestion updated", updatedSuggestion });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  // ---------------- DELETE (mark as deleted) ----------------
  if (method === "DELETE") {
    try {
      const { suggestionId } = req.body;

      const contentToDelete = await Suggestion.findById(suggestionId);

      if (!contentToDelete)
        return res.status(404).json({ error: "Suggestion not found" });

      const deletionOwnershipCheck = await checkOwnership({
        req,
        res,
        resourceCreatorId: contentToDelete.suggestionBy.toString(),
      });
      if (!deletionOwnershipCheck) return null;

      contentToDelete.status = "deleted";
      contentToDelete.outcome = "deletedByUser";

      await contentToDelete.save();

      return res.status(200).json({ message: "Suggestion deleted" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
