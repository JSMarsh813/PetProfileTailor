import dbConnect from "@utils/db";
import Names from "@models/Name";
import { checkMultipleFieldsBlocklist } from "@/utils/api/checkMultipleBlocklists";
import normalizeString from "@/utils/stringManipulation/normalizeString";
import { respondIfBlocked } from "@/utils/api/checkMultipleBlocklists";
import regexInvalidInput from "@/utils/stringManipulation/check-for-valid-names";

export async function GET(req, { params }) {
  await dbConnect.connect();

  const { name } = await params;

  // 1. Blocklist check
  const blockResult = checkMultipleFieldsBlocklist([
    { value: name, type: "names", fieldName: "content" },
  ]);

  const errorResponse = respondIfBlocked(blockResult);
  if (errorResponse) return errorResponse;

  // 2. Invalid character check
  const invalidChars = regexInvalidInput(name);

  if (invalidChars) {
    return Response.json(
      {
        type: "invalid",
        message: `Ruh Roh! The name ${name} has invalid character(s) ${invalidChars}`,
      },
      { status: 400 },
    );
  }

  try {
    const normalizedString = normalizeString(name);
    const existingNameCheck = await Names.find({
      normalizedContent: { $regex: new RegExp(`^${normalizedString}$`, "i") },
    }).populate({
      path: "createdBy",
      select: ["name", "profileName", "profileImage"],
    });

    // find returns an array
    if (existingNameCheck.length > 0) {
      return Response.json({
        type: "duplicate",
        data: existingNameCheck,
      });
    } else {
      return Response.json({
        type: "success",
        message: "Success! That name is not in the database",
      });
    }
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
