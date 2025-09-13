import mongoose from "mongoose";

const DescriptionTagSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
  },
  createdby: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "User",
  },
});

const DescriptionTag =
  mongoose.models.DescriptionTag ||
  mongoose.model("DescriptionTag", DescriptionTagSchema);

export default DescriptionTag;
