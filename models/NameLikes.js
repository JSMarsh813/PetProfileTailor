import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const NameLikesSchema = new mongoose.Schema(
  {
    userId: { type: ObjectId, ref: "Users", required: true },
    nameId: { type: ObjectId, ref: "Names", required: true },
  },
  { timestamps: true },
);

// prevent duplicate likes
NameLikesSchema.index({ userId: 1, nameId: 1 }, { unique: true });
// NameLikesSchema.index
// An index in MongoDB is like a sorted lookup table for faster queries.
// Instead of scanning the entire collection to find matches, MongoDB jumps straight to the right place in the index.
// In this case, you’re building an index on two fields: userId and nameId.

//{ userId: 1, nameId: 1 }
//“Make an index where documents are sorted by userId first, then by nameId.”
// since we'd need to return a list of names that match the userID for the dashboard, so userID is the bigger priority

// { unique: true }
//makes the combination of userId + nameId unique across the entire collection, so it can only be liked once

const NameLikes =
  mongoose.models.NameLikes ||
  mongoose.model("NameLikes", NameLikesSchema, "namelikes");

export default NameLikes;
