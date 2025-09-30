import dbConnect from "@utils/db";
import mongoose from "mongoose";
import Description from "@/models/Description";
import { checkOwnership } from "@/utils/api/checkOwnership";
import { getSessionForApis } from "@/utils/api/getSessionForApis";

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
  const { description } = body;

  const { ok, session } = await getSessionForApis({ req });
  if (!ok) {
    return new Response("Unauthorized", { status: 401 });
  }

  const existingDescriptionCheck = await Description.find({
    content: description,
  });

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

  const toUpdateDescription = await Description.findById(contentId);

  const { ok } = await checkOwnership({
    req,
    resourceCreatorId: toUpdateDescription.createdBy,
  });
  if (!ok) return new Response("Unauthorized", { status: 401 });

  try {
    if (notes) toUpdateDescription.notes = notes;
    toUpdateDescription.content = content;
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
