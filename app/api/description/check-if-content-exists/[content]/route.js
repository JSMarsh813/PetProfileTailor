import dbConnect from "@utils/db";
import Description from "@/models/Description";
import { checkMultipleFieldsBlocklist } from "@/utils/api/checkMultipleBlocklists";

import { respondIfBlocked } from "@/utils/api/checkMultipleBlocklists";

import { findStartNormalized } from "@/utils/stringManipulation/findNormalizedMatch";

export async function GET(req, { params }) {
  await dbConnect.connect();

  const { content } = await params;

  // 1. Blocklist check
  const blockResult = checkMultipleFieldsBlocklist([
    { value: content, fieldName: "content" },
  ]);

  const errorResponse = respondIfBlocked(blockResult);
  if (errorResponse) return errorResponse;

  // // 2. Invalid character check
  // const invalidChars = regexInvalidInput(content);

  // if (invalidChars) {
  //   return Response.json(
  //     {
  //       type: "invalid",
  //       message: `Ruh Roh! The content ${content} has invalid character(s) ${invalidChars}`,
  //     },
  //     { status: 400 },
  //   );
  // }

  try {
    const existingContentCheck = findStartNormalized(Description, content);

    // find returns an array
    if (existingContentCheck.length) {
      return Response.json({
        type: "duplicate",
        data: existingContentCheck,
      });
    } else {
      return Response.json({
        type: "success",
        message: "Success! That content is not in the database",
      });
    }
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
