const mongoose = require("mongoose");

const DescriptionCategorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "descriptiontag",
    },
  ],
});

module.exports =
  mongoose.models["descriptioncategory"] ||
  mongoose.model("descriptioncategory", DescriptionCategorySchema);
