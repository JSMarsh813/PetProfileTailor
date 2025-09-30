import dbConnect from "@utils/db";
import DescriptionTag from "@/models/DescriptionTag";
import { checkIfAdmin } from "@/utils/api/checkIfAdmin";

export async function GET() {
  await dbConnect.connect();

  try {
    const descriptionTags = await DescriptionTag.find();
    return Response.json(descriptionTags, { status: 200 });
  } catch (err) {
    console.error("Error fetching description tags:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect.connect();

  const { ok, session, response } = await checkIfAdmin({ req });
  if (!ok) return response;

  try {
    const body = await req.json();

    const descriptionTag = await DescriptionTag.create({
      ...body,
      createdBy: session.user.id,
    });

    return Response.json(descriptionTag, { status: 201 });
  } catch (err) {
    console.error("Error creating description tag:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
