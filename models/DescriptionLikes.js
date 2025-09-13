import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const DescriptionLikesSchema = new mongoose.Schema(
  {
    userId: { type: ObjectId, ref: "Users", required: true },
    descriptionId: { type: ObjectId, ref: "Descriptions", required: true },
  },
  { timestamps: true },
);

// prevent duplicate likes
DescriptionLikesSchema.index({ userId: 1, descriptionId: 1 }, { unique: true });
// DescriptionLikesSchema.index
// An index in MongoDB is like a sorted lookup table for faster queries.
// Instead of scanning the entire collection to find matches, MongoDB jumps straight to the right place in the index.
// In this case, you’re building an index on two fields: userId and descriptionId.

//{ userId: 1, descriptionId: 1 }
//“Make an index where documents are sorted by userId first, then by descriptionId.”
// since we'd need to return a list of descriptions that match the userID for the dashboard, so userID is the bigger priority

// { unique: true }
//makes the combination of userId + descriptionId unique across the entire collection, so it can only be liked once

const DescriptionLikes =
  mongoose.models.DescriptionLikes ||
  mongoose.model(
    "DescriptionLikes",
    DescriptionLikesSchema,
    "descriptionlikes",
  );

export default DescriptionLikes;
