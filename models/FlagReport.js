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
      type: Object,
      default: {},
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
    comments: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "under_review",
        "action_required",
        "resolved",
        "dismissed",
      ],
      default: "pending",
      required: true,
    },
    outcome: {
      type: String,
      enum: ["pending", "dismissed", "warning_issued", "content_removed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["unrated", "low", "medium", "high", "critical"],
      default: "unrated",
    },
  },
  { timestamps: true },
);

FlagReportSchema.statics.fieldDescriptions = {
  status: "Current stage of moderation workflow",
  outcome: "Result of the moderation review",
  priority: "How urgent or serious the report is",
  flagcategories: "Categories applied by the user when reporting",
  comments: "Optional notes provided by the user",
};

const FlagReport =
  mongoose.models.FlagReport || mongoose.model("FlagReport", FlagReportSchema);
export default FlagReport;
