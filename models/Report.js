import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    contentType: {
      type: String,
      enum: ["names", "descriptions", "users"],
      required: true,
      unique: false,
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: false,
    },
    contentCopy: {
      type: Object,
      default: {},
      required: true,
      unique: false,
    },
    contentCreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    reportCategories: {
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
  reportCategories: "Categories applied by the user when reporting",
  comments: "Optional notes provided by the user",
};

const Report = mongoose.models.Report || mongoose.model("Report", ReportSchema);
export default Report;
