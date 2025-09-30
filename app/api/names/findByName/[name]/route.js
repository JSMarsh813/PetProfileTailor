import dbConnect from "@utils/db";
import Names from "@models/Name";

export async function GET(req, { params }) {
  await dbConnect.connect();

  const name = params.name;

  try {
    const individualNames = await Names.find({ content: name }).populate({
      path: "createdBy",
      select: ["name", "profileName", "profileImage"],
    });

    return Response.json(individualNames);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
