import dbConnect from "@utils/db";
import Names from "@models/Name";

export async function GET(req) {
  await dbConnect.connect();

  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

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
