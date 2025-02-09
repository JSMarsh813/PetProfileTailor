const mongoose = require("mongoose");
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
    shares: {
      type: Array,
      default: [],
    },
    likedby: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: "descriptiontag",
      },
    ],
    flaggedby: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: "User",
      },
    ],
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
