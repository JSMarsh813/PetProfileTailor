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
    likedby: {
      type: Array,
      default: [],
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "descriptiontag",
      },
    ],
    relatednames: {
      type: Array,
    },
  },
  { timestamps: true }
);

const Description =
  mongoose.models.description ||
  mongoose.model("description", DescriptionSchema);
export default Description;
