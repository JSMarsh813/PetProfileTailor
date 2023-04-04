const mongoose = require("mongoose");

const namecommentSchema = new mongoose.Schema(
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
    parentcommentid: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    likedby: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const namecomment =
  mongoose.models.namecomment ||
  mongoose.model("namecomment", namecommentSchema);
export default namecomment;
