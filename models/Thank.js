import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;
import thanksOptions from "@/data/ThanksOptions";

const allowedMessages = thanksOptions.map((option) => option.tag);
const ThankSchema = new mongoose.Schema(
  {
    contentCreator: { type: ObjectId, ref: "User", required: true },
    thanksBy: { type: ObjectId, ref: "User", required: true },
    contentType: {
      type: String,
      required: true,
      enum: ["names", "descriptions"],
    },
    nameId: {
      type: ObjectId,
      ref: "Name",
      required: function () {
        return this.contentType === "names";
      },
      default: null,
    },
    descriptionId: {
      type: ObjectId,
      ref: "Description",
      required: function () {
        return this.contentType === "description";
      },
      default: null,
    },
    read: { type: Boolean, default: false },
    messages: {
      type: [
        {
          type: String,
          enum: allowedMessages,
        },
      ],
      required: true,
      default: [],
    },
  },
  { timestamps: true },
);

ThankSchema.index({
  contentCreator: 1,
  nameId: 1,
  descriptionId: 1,
  thanksBy: 1,
});

const Thank =
  mongoose.models.Thank || mongoose.model("Thank", ThankSchema, "thanks");

export default Thank;
