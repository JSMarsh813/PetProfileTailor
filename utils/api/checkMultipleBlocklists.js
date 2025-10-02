// utils/blocklistHelpers.js
import { checkBlocklists } from "@/lib/checkBlocklist";
import bannedWordsMessage from "@/utils/api/bannedWordsMessage";
// 1️⃣ Check multiple fields for blocklist violations
export function checkMultipleFieldsBlocklist(fields) {
  // fields = [{ value, type, fieldName }, ...]
  for (const { value, type, fieldName } of fields) {
    const {
      allowed,
      blockedBy,
      type: blockType,
    } = checkBlocklists(value, type);
    if (!allowed) {
      return { fieldName, value, blockedBy, blockType };
    }
  }
  return null; // nothing blocked
}

// 2️⃣ Respond with 403 if a violation exists
export function respondIfBlocked(blockResult) {
  if (!blockResult) return null;

  const { value, blockedBy, blockType } = blockResult;
  return Response.json(
    {
      message: bannedWordsMessage(value, blockedBy, blockType),
    },
    { status: 403 },
  );
}
