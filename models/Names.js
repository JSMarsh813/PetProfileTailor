import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const NameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: Array,
    required: false,
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
      ref: "NameTag",
    },
  ],
  flaggedby: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
      ref: "User",
    },
  ],
  likedby: [
    {
      type: mongoose.Schema.Types.ObjectId,
      default: [],
      ref: "User",
    },
  ],
  likedbycount: {
    type: Number,
    default: 0,
  },
  createdby: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

NameSchema.plugin(uniqueValidator);

const Names =
  mongoose.models.Names || mongoose.model("Names", NameSchema, "names");
// the last one "names" is for when we're doing migration, the migration script we need to explicitly pass the existing colleciton name in mongoDB to the migration script
// why? since the migration script runs outside the usual app context.

export default Names;
