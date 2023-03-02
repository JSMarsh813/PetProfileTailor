const mongoose = require("mongoose");

const DescriptionTagSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
  },
  createdby: {
    type: String,
    default: "",
  },
});

const DescriptionTag =
  mongoose.models.descriptiontag ||
  mongoose.model("descriptiontag", DescriptionTagSchema);
export default DescriptionTag;
