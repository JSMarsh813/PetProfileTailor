import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const DescriptionLikeSchema = new mongoose.Schema(
  {
    likedBy: { type: ObjectId, ref: "User", required: true },
    contentCreator: { type: ObjectId, ref: "User", required: true },
    descriptionId: { type: ObjectId, ref: "Description", required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// prevent duplicate likes
DescriptionLikeSchema.index({ userId: 1, descriptionId: 1 }, { unique: true });
// DescriptionLikesSchema.index
// An index in MongoDB is like a sorted lookup table for faster queries.
// Instead of scanning the entire collection to find matches, MongoDB jumps straight to the right place in the index.
// In this case, you’re building an index on two fields: userId and descriptionId.

//{ userId: 1, descriptionId: 1 }
//“Make an index where documents are sorted by userId first, then by descriptionId.”
// since we'd need to return a list of descriptions that match the userID for the dashboard, so userID is the bigger priority

// { unique: true }
//makes the combination of userId + descriptionId unique across the entire collection, so it can only be liked once

const DescriptionLike =
  mongoose.models.DescriptionLike ||
  mongoose.model("DescriptionLike", DescriptionLikeSchema, "descriptionlikes");

export default DescriptionLike;
