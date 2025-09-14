import mongoose from "mongoose";
import { Schema } from "mongoose";

const DescriptionSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      unique: false,
    },
    notes: {
      type: String,
      required: false,
    },
    createdby: {
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
    likedbycount: {
      type: Number,
      default: 0,
    },

    relatednames: {
      type: Array,
    },
  },
  { timestamps: true },
);

const Description =
  mongoose.models.description ||
  mongoose.model("description", DescriptionSchema);
export default Description;
