import mongoose from "mongoose";

export default function convertToObjectId(input) {
  // if its an array, convert the whole thing
  if (Array.isArray(input)) {
    return input.map((id) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId string: ${id}`);
      }
      return new mongoose.Types.ObjectId(id);
    });
  }

  if (!mongoose.Types.ObjectId.isValid(input)) {
    throw new Error(`Invalid ObjectId string: ${input}`);
  }
  // otherwise its a single string, so just convert that one
  return new mongoose.Types.ObjectId(input);
}
