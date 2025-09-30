import mongoose from "mongoose";

const DescriptionTagSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const DescriptionTag =
  mongoose.models.DescriptionTag ||
  mongoose.model("DescriptionTag", DescriptionTagSchema);

export default DescriptionTag;
