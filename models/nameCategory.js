import mongoose from "mongoose";
import NameTag from "./NameTag"; // just to register schema for populate

const NameCategorySchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "NameTag" }],
  order: { type: Number, default: 0 },
});

const NameCategory =
  mongoose.models.NameCategory ||
  mongoose.model("NameCategory", NameCategorySchema);

export default NameCategory;
