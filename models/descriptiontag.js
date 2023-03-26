const mongoose = require("mongoose");

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
  mongoose.models.descriptiontag ||
  mongoose.model("descriptiontag", DescriptionTagSchema);
export default DescriptionTag;
