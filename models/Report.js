import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    contenttype: {
      type: String,
      enum: ["names", "descriptions", "users"],
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
    contentcreatedby: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    reportedby: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    reportcategories: {
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
        "deleted",
      ],
      default: "pending",
      required: true,
    },
    outcome: {
      type: String,
      enum: [
        "pending",
        "dismissed",
        "warningIssued",
        "contentRemoved",
        "deletedByUser",
      ],
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

ReportSchema.statics.fieldDescriptions = {
  status: "Current stage of moderation workflow",
  outcome: "Result of the moderation review",
  priority: "How urgent or serious the report is",
  reportcategories: "Categories applied by the user when reporting",
  comments: "Optional notes provided by the user",
};

const Report = mongoose.models.Report || mongoose.model("Report", ReportSchema);
export default Report;
