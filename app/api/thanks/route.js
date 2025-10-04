import db from "@utils/db";
import Name from "@/models/Name";
import Description from "@/models/Description";
import User from "@/models/User";
import Thanks from "@/models/Thank";
import { leanWithStrings } from "@/utils/mongoDataCleanup";
import { getSessionForApis } from "@/utils/api/getSessionForApis";
import { checkIfValidContentType } from "@/utils/api/checkIfValidContentType";

// ---------------- POST (create a thank you) ----------------
export async function POST(req) {
  await db.connect();

  const { ok, session, response } = await getSessionForApis({ req });
  if (!ok) return response;

  const userId = session.user.id;

  try {
    const { contentType, contentCreator, contentId, messages } =
      await req.json();

    if (!contentType || !contentId || !contentCreator || !messages) {
      return Response.json(
        {
          error:
            "Missing required parameter: contentType, contentId, contentCreator, messages",
        },
        { status: 400 },
      );
    }

    if (contentCreator === userId) {
      return Response.json(
        {
          message:
            "Nice try! But you cannot add a thank you note to your own content 😉",
        },
        { status: 400 },
      );
    }

    checkIfValidContentType(contentType);

    // Determine which field to populate
    const nameId = contentType === "names" ? contentId : null;
    const descriptionId = contentType === "description" ? contentId : null;

    const existingThanksCount = await Thanks.countDocuments({
      thanksBy: userId,
      nameId,
      descriptionId,
    });

    if (existingThanksCount >= 10) {
      return Response.json(
        {
          message:
            "You have reached the maximum thank you notes for this content",
        },
        { status: 400 },
      );
    }

    const thanks = await Thanks.create({
      contentType,
      contentCreator,
      thanksBy: userId,
      nameId,
      descriptionId,
      messages,
    });

    return Response.json(
      {
        thanks,
        message: "Thanks successfully submitted, thank you!",
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Error creating thanks:", err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}

// ---------------- GET (fetch thanks) ----------------
export async function GET(req) {
  await db.connect();

  const { ok, session, response } = await getSessionForApis({ req });
  if (!ok) return response;

  const userId = session.user.id;

  try {
    const { searchParams } = new URL(req.url);
    const contentType = searchParams.get("contentType");
    const contentId = searchParams.get("contentId");

    if (!contentType || !contentId) {
      return Response.json(
        { error: "Missing contentType or contentId" },
        { status: 400 },
      );
    }

    checkIfValidContentType(contentType);

    const nameOrDescriptionId =
      contentType === "names" ? "nameId" : "descriptionId";

    const thanks = await leanWithStrings(
      Thanks.findOne({
        [nameOrDescriptionId]: contentId,
        thanksBy: userId,
      })
        .sort({ createdAt: -1 })
        .populate({ path: "contentCreator", select: ["name", "profileName"] })
        .populate({ path: "thanksBy", select: ["name", "profileName"] })
        .populate({ path: "nameId", select: ["content"] })
        .populate({ path: "descriptionId", select: ["content"] }),
    );

    if (!thanks) {
      return Response.json({ error: "Thanks not found" }, { status: 404 });
    }

    return Response.json({ thanks }, { status: 200 });
  } catch (err) {
    console.error("Error fetching thanks:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

// import db from "@utils/db";
// import Thanks from "@/models/Thank";
// import mongoose from "mongoose";
// import { leanWithStrings } from "@/utils/mongoDataCleanup";
// import { getSessionForApis } from "@/utils/api/getSessionForApis";
// import { checkIfValidContentType } from "@/utils/api/checkIfValidContentType";

// export default async function handler(req, res) {
//   const { method } = req;

//   await db.connect();

//   const { ok, session } = await getSessionForApis({ req, res });
//   if (!ok) {
//     s;
//     return;
//   }

//   const userId = session.user.id;

//   // ---------------- POST (create a thank you) ----------------
//   if (method === "POST") {
//     const { contentType, contentCreator, contentId, messages } = req.body;

//     if (!contentType || !contentId || !contentCreator || !messages) {
//       return res.status(400).json({
//         error:
//           "Missing required paramater of one of those types: contentType, contentId, contentCreator, messages",
//       });
//     }

//     console.log("req.body for thanks", req.body);

//     if (contentCreator === userId) {
//       return res.status(400).json({
//         message:
//           "Nice try! But you cannot add a thank you note to your own content 😉",
//       });
//     }

//     checkIfValidContentType(contentType);

//     // Determine which field to populate
//     const nameId = contentType === "names" ? contentId : null;
//     const descriptionId = contentType === "description" ? contentId : null;

//     const existingThanksCount = await Thanks.countDocuments({
//       thanksBy: userId,
//       nameId,
//       descriptionId,
//     });

//     if (existingThanksCount >= 10) {
//       return res.status(400).json({
//         message:
//           "You have reached the maximum thank you notes for this content",
//       });
//     }

//     try {
//       const thanks = await Thanks.create({
//         contentType,
//         contentCreator,
//         thanksBy: userId,
//         nameId,
//         descriptionId,
//         messages,
//       });

//       return res.status(201).json({
//         thanks,
//         message: "Thanks successfully submitted, thank you!",
//       });
//     } catch (err) {
//       console.error("Error creating thanks:", err);
//       return res.status(500).json({ message: "Server error" });
//     }
//   }

//   // ---------------- GET (fetch thanks) ----------------
//   if (method === "GET") {
//     try {
//       const { contentType, contentId } = req.query;

//       if (!contentType || !contentId) {
//         return res
//           .status(400)
//           .json({ error: "Missing contentType or contentId" });
//       }

//       checkIfValidContentType(contentType);

//       const nameOrDesciptionId =
//         contentType === "names" ? "nameId" : "descriptionId";

//       const thanks = await leanWithStrings(
//         Thanks.findOne({
//           [nameOrDesciptionId]: contentId,
//           thanksBy: userId,
//         })
//           .sort({ createdAt: -1 })
//           .populate({ path: "contentCreator", select: ["name", "profileName"] })
//           .populate({ path: "thanksBy", select: ["name", "profileName"] })
//           .populate({ path: "nameId", select: ["content"] })
//           .populate({ path: "descriptionId", select: ["content"] }),
//       );

//       if (!thanks) {
//         return res.status(404).json({ error: "Thanks not found" });
//       }

//       return res.status(200).json({ thanks });
//     } catch (err) {
//       console.error("Error fetching thanks:", err);
//       return res.status(500).json({ error: "Server error" });
//     }
//   }

//   return res.status(405).json({ error: "Method not allowed" });
// }
