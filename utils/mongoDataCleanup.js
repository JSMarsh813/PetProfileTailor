import mongoose from "mongoose";

function deepTransform(obj) {
  /**
   * Converts a Mongoose query result into plain JS object(s) with:
   * - ObjectIds stringified (including arrays of ObjectIds)
   * - __v removed
   * Works for both single doc and array of docs
   */

  // Handle ObjectIds directly (standalone or as field values)
  if (obj instanceof mongoose.Types.ObjectId) {
    return obj.toString();
  }

  // Handle Dates
  if (obj instanceof Date) return obj; // keep as Date

  if (Array.isArray(obj)) {
    return obj.map((item) => {
      // If item is a plain ObjectId, stringify
      if (item instanceof mongoose.Types.ObjectId) return item.toString();
      return deepTransform(item);
    });
  } else if (obj && typeof obj === "object") {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key === "__v") continue;

      // If it's an array of ObjectIds, convert each
      if (
        Array.isArray(value) &&
        value.every((v) => v instanceof mongoose.Types.ObjectId)
      ) {
        newObj[key] = value.map((v) => v.toString());
      } else {
        newObj[key] = deepTransform(value);
      }
    }
    return newObj;
  }

  return obj;
}

export async function leanWithStrings(query) {
  const result = await query.lean().exec();
  //.lean() gives raw JS objects without Mongoose wrappers.
  // .exec() actually runs the query, to get the query results instead of the query object itself
  if (Array.isArray(result)) {
    return result.map(deepTransform);
  } else if (result) {
    return deepTransform(result);
  } else {
    return null; // no document found
  }
}
