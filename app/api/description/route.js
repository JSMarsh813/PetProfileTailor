import dbConnect from "@utils/db";
import mongoose from "mongoose";
import Description from "@/models/Description";
import { checkOwnership } from "@/utils/api/checkOwnership";
import { getSessionForApis } from "@/utils/api/getSessionForApis";
import { checkMultipleFieldsBlocklist } from "@/utils/api/checkMultipleBlocklists";
import { respondIfBlocked } from "@/utils/api/checkMultipleBlocklists";
import normalizeString from "@/utils/stringManipulation/normalizeString";

async function checkDuplicateDescription(content, existingDescription) {
  if (
    content?.toLowerCase() &&
    content !== existingDescription.content?.toLowerCase()
    // ? handles when content is null
  ) {
    const normalizedSnippet = normalizeString(content).slice(0, 120);
    const existingDescriptionCheck = await Description.findOne({
      normalizedContent: { $regex: new RegExp(`^${normalizedSnippet}$`, "i") },
    });
    return returnExistingMessage(existingDescriptionCheck);
  }
  return null;
}

function returnExistingMessage(existingDescriptionCheck) {
  if (existingDescriptionCheck) {
    // existing description check is an object or null
    return Response.json(
      {
        message: "Description already exists",
        existingDescription: existingDescriptionCheck,
      },
      { status: 409 },
    );
  }
  return null;
}

// ############################ GET ################################################### //

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

// ############################ POST ################################################### //

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

  const errorResponse = respondIfBlocked(blockResult);
  if (errorResponse) return errorResponse;

  // ****************** checking for duplicates with snippet ****************************

  const existingMessage = await checkDuplicateDescription(content, {
    content: null,
  });
  if (existingMessage) return existingMessage;

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

// ############################ PUT ################################################### //

export async function PUT(req) {
  await dbConnect.connect();

  const body = await req.json();
  const { notes, content, tags, contentId } = body.submission;
  const existingDescription = await Description.findById(contentId);

  // ************** content or notes checks *************************** //

  if (content || notes) {
    const blockResult = checkMultipleFieldsBlocklist([
      { value: content, type: "descriptions", fieldName: "content" },
    ]);

    const errorResponse = respondIfBlocked(blockResult);
    if (errorResponse) return errorResponse;

    const existingMessage = await checkDuplicateDescription(
      content,
      existingDescription,
    );
    if (existingMessage) return existingMessage;
  }

  // ************* checking ownership and updating ***************** //

  const { ok } = await checkOwnership({
    req,
    resourceCreatorId: existingDescription.createdBy,
  });
  if (!ok) return new Response("Unauthorized", { status: 401 });

  try {
    if (notes) existingDescription.notes = notes;
    if (content) {
      (existingDescription.content = content),
        (existingDescription.normalizedContent = normalizeString(content).slice(
          0,
          120,
        ));
    }
    existingDescription.tags = tags;

    await existingDescription.save();

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

// ############################ DELETE ################################################### //

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
