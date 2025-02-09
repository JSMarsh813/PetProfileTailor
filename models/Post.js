const mongoose = require("mongoose");
import { Schema } from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    image: {
      type: Array,
      required: false,
      unique: false,
    },
    alttext: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: false,
      unique: false,
    },
    description: {
      type: String,
      required: true,
      unique: false,
    },
    flaggedby: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: "User",
      },
    ],
    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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
    taglist: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true },
);

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
export default Post;
