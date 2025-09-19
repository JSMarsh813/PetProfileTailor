import mongoose from "mongoose";

const SuggestionsSchema = new mongoose.Schema(
  {
    contentType: {
      type: String,
      required: true,
      unique: false,
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: false,
    },
    contentCreator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: false,
      ref: "User",
    },
    suggestionBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: false,
      ref: "User",
    },
    categories: {
      type: Array,
      required: true,
      default: [],
    },
    description: {
      type: String,
    },
    comments: {
      type: String,
    },
    incorrectNameTags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: "NameTag",
      },
    ],
    incorrectDescriptionTags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: "DescriptionTag",
      },
    ],
    nameTagsSuggested: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: "NameTag",
      },
    ],
    descriptionTagsSuggested: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: "DescriptionTag",
      },
    ],
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
      required: true,
    },
  },
  { timestamps: true },
);

SuggestionsSchema.statics.fieldDescriptions = {
  status: "Current stage of moderation workflow",
  outcome: "Result of the moderation review",
  priority: "How urgent or serious the report is",
  ideaCategories:
    "Categories applied by the user when sending in their suggested changes",
  comments: "Optional notes provided by the user",
};

const Suggestions =
  mongoose.models.Suggestions ||
  mongoose.model("Suggestions", SuggestionsSchema);
export default Suggestions;
