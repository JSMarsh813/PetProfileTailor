const mongoose = require("mongoose");

const FlagReportSchema = new mongoose.Schema(
  {
    contenttype: {
      type: String,
      required: true,
      unique: false,
    },
    contentid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: false,
    },
    contentcopy: {
      type: Array,
      default: [],
      required: true,
      unique: false,
    },
    createdbyuser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    flaggedbyuser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    flagcategories: {
      type: Array,
      required: true,
      default: [],
    },
    reportcomments: {
      type: String,
      required: false,
    },
    reviewed: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

const FlagReport =
  mongoose.models.FlagReport || mongoose.model("FlagReport", FlagReportSchema);
export default FlagReport;
