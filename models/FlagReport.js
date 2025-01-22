const mongoose = require("mongoose");

const FlagReportSchema = new mongoose.Schema(
  {
    contentid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: false,
    },
    maincontent: {
      type: String,
      required: true,
      unique: false,
    },
    secondarycontent: {
      type: String,
      required: true,
      unique: false,
    },
    contenttype: {
      type: String,
      required: true,
      unique: false,
    },
    createdbyuser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    comments: {
      type: String,
      required: false,
    },
    flagcategories: {
      type: Array,
      default: [],
    },
    flaggedbyusers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

const FlagReport =
  mongoose.models.FlagReport || mongoose.model("FlagReport", FlagReportSchema);
export default FlagReport;
