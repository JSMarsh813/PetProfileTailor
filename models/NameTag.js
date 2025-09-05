import mongoose from "mongoose";

const NameTagSchema = new mongoose.Schema({
  tag: { type: String, required: true },
  createdby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const NameTag =
  mongoose.models.NameTag || mongoose.model("NameTag", NameTagSchema);

export default NameTag;
