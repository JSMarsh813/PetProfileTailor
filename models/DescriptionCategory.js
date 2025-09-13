import mongoose from "mongoose";

import DescriptionTag from "./DescriptionTag";
const DescriptionCategorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DescriptionTag",
    },
  ],
});

const DescriptionCategory =
  mongoose.models.DescriptionCategory ||
  mongoose.model("DescriptionCategory", DescriptionCategorySchema);

export default DescriptionCategory;
