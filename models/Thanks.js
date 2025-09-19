import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;
import thanksOptions from "@/data/ThanksOptions";

const allowedMessages = thanksOptions.map((option) => option.tag);
const ThanksSchema = new mongoose.Schema(
  {
    creatorId: { type: ObjectId, ref: "Users", required: true },
    thankedById: { type: ObjectId, ref: "Users", required: true },
    nameId: { type: ObjectId, ref: "Names", required: true },
    descriptionId: { type: ObjectId, ref: "Description", required: true },
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

ThanksSchema.index({
  userId: 1,
  nameId: 1,
  descriptionId: 1,
  thankedById: 1,
});

const Thanks =
  mongoose.models.Thanks || mongoose.model("Thanks", ThanksSchema, "thanks");

export default Thanks;
