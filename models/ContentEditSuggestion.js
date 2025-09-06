const mongoose = require("mongoose");

const ContentEditSuggestionSchema = new mongoose.Schema(
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
    ideabyuser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    ideaCategories: {
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
      enum: [
        "pending",
        "dismissed",
        "added_content",
        "edited_content",
        "other",
      ],
      default: "none",
    },
    priority: {
      type: String,
      enum: ["unrated", "low", "medium", "high", "critical"],
      default: "unrated",
    },
  },
  { timestamps: true },
);

ContentEditSuggestionSchema.statics.fieldDescriptions = {
  status: "Current stage of moderation workflow",
  outcome: "Result of the moderation review",
  priority: "How urgent or serious the report is",
  ideaCategories:
    "Categories applied by the user when sending in their suggested changes",
  comments: "Optional notes provided by the user",
};

const ContentEditSuggestion =
  mongoose.models.ContentEditSuggestion ||
  mongoose.model("ContentEditSuggestion", ContentEditSuggestionSchema);
export default ContentEditSuggestion;
