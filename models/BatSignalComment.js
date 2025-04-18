const mongoose = require("mongoose");

const BatSignalCommentSchema = new mongoose.Schema(
  {
    image: {
      type: Array,
      required: false,
      unique: false,
    },
    description: {
      type: String,
      required: true,
      unique: false,
    },
    replyingtothisid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: false,
    },
    replyingtothiscontent: {
      type: String,
      required: false,
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
    parentcommentid: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
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
  },
  { timestamps: true },
);

const BatSignalComment =
  mongoose.models.BatSignalComment ||
  mongoose.model("BatSignalComment", BatSignalCommentSchema);
export default BatSignalComment;
