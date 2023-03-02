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
      type: String,
      required: true,
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
    tags: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

const Description =
  mongoose.models.description ||
  mongoose.model("description", DescriptionSchema);
export default Description;
