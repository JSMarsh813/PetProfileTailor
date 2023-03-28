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
    taglist: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.models.Posts || mongoose.model("Posts", PostSchema);
export default Post;
