import dbConnect from "@utils/db";
import mongoose from "mongoose";
import Description from "@/models/Description";
import { checkOwnership } from "@/utils/api/checkOwnership";
import { getSessionForApis } from "@/utils/api/getSessionForApis";
import { checkMultipleFieldsBlocklist } from "@/utils/api/checkMultipleBlocklists";
import { respondIfBlocked } from "@/utils/api/checkMultipleBlocklists";
import normalizeString from "@/utils/api/normalizeString";

export async function GET(req) {
  await dbConnect.connect();

  try {
    const descriptions = await Description.find()
      .populate({
        path: "createdBy",
        select: ["name", "profileName", "profileImage"],
      })
      .populate({ path: "tags", select: ["tag"] });

    return Response.json(descriptions);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect.connect();

  const body = await req.json();
  const { content, notes } = body;

  const { ok, session } = await getSessionForApis({ req });
  if (!ok) {
    return new Response("Unauthorized", { status: 401 });
  }

  const blockResult = checkMultipleFieldsBlocklist([
    { value: content, type: "descriptions", fieldName: "content" },
  ]);

  const errorResponse = respondIfBlocked(blockResult, existingNameCheck);
  if (errorResponse) return errorResponse;

  const normalizedStringSnippet = normalizeString(content).slice(0, 120);
  const existingDescriptionCheck = await Description.find({
    normalizedContent: { $regex: normalizedStringSnippet, $options: "i" },
  });
  // this will return positive if there is a partial match, because of the regex
  // $regex searches for substring matches

  if (existingDescriptionCheck && existingDescriptionCheck.length !== 0) {
    return Response.json(
      {
        message: "Description already exists",
        existingDescription: existingDescriptionCheck,
      },
      { status: 409 },
    );
  }

  try {
    const newDescription = await Description.create({
      ...body,
      normalizedContent: normalizeString(content).slice(0, 120),
      createdBy: session.user.id,
    });

    return Response.json(newDescription, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  await dbConnect.connect();

  const body = await req.json();
  const { notes, content, tags, contentId } = body.submission;

  if (content | notes) {
    const blockResult = checkMultipleFieldsBlocklist([
      { value: content, type: "descriptions", fieldName: "content" },
    ]);

    const errorResponse = respondIfBlocked(blockResult, existingNameCheck);
    if (errorResponse) return errorResponse;
  }

  const toUpdateDescription = await Description.findById(contentId);

  const { ok } = await checkOwnership({
    req,
    resourceCreatorId: toUpdateDescription.createdBy,
  });
  if (!ok) return new Response("Unauthorized", { status: 401 });

  try {
    if (notes) toUpdateDescription.notes = notes;
    if (content) {
      (toUpdateDescription.content = content),
        (toUpdateDescription.normalizedContent = normalizeString(content).slice(
          0,
          120,
        ));
    }
    toUpdateDescription.tags = tags;

    await toUpdateDescription.save();

    const updatedDescription = await Description.findById(contentId)
      .populate({
        path: "createdBy",
        select: "name profileName profileImage",
      })
      .populate({ path: "tags", select: "tag" });

    return Response.json({
      data: updatedDescription,
      message: "Description Updated",
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  await dbConnect.connect();

  const body = await req.json();
  const contentId = body.contentId;

  try {
    const nameToBeDeleted = await Description.findById(
      mongoose.Types.ObjectId(contentId),
    );

    const { ok } = await checkOwnership({
      req,
      resourceCreatorId: nameToBeDeleted.createdBy,
    });
    if (!ok) return new Response("Unauthorized", { status: 401 });

    await Description.deleteOne({ _id: contentId });

    return Response.json({ success: true, msg: `Description Deleted` });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
