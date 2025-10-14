import User from "@models/User";
import db from "@utils/db";
import { getSessionForApis } from "@/utils/api/getSessionForApis";
import { v2 as cloudinary } from "cloudinary";

function extractCloudinaryId(url) {
  try {
    const parts = url.split("/upload/")[1].split(".")[0];
    return parts.replace(/^v\d+\//, "");
    // example "profileimage/uj1qca1lcdz3wad9qefi"
  } catch {
    return null;
  }
}

export async function PUT(req) {
  const { ok, session } = await getSessionForApis({ req });
  if (!ok) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), {
      status: 401,
    });
  }

  await db.connect();
  const userId = session.user.id;
  const { newProfileImage } = await req.json();

  const user = await User.findById(userId);
  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });
  }
  const oldCloudinaryId = extractCloudinaryId(user.profileImage);

  user.profileImage = newProfileImage;
  await user.save();

  // Delete old image if it exists
  if (oldCloudinaryId) {
    try {
      await cloudinary.uploader.destroy(oldCloudinaryId);
    } catch (err) {
      console.error("Failed to delete old image:", err);
    }
  }

  return new Response(JSON.stringify({ message: "Profile image updated" }), {
    status: 200,
  });
}
