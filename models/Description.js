import mongoose from "mongoose";
import { Schema } from "mongoose";

const DescriptionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      unique: false,
    },
    notes: {
      type: String,
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },

    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: "DescriptionTag",
      },
    ],
    likedByCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Description =
  mongoose.models.Description ||
  mongoose.model("Description", DescriptionSchema);
export default Description;
