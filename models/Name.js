import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const NameSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      unique: true,
    },
    notes: {
      type: String,
      required: false,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: "NameTag",
      },
    ],

    likedByCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true },
);

NameSchema.plugin(uniqueValidator);

const Name =
  mongoose.models.Name || mongoose.model("Name", NameSchema, "names");
// the last one "names" is for when we're doing migration, the migration script we need to explicitly pass the existing colleciton name in mongoDB to the migration script
// why? since the migration script runs outside the usual app context.

export default Name;
