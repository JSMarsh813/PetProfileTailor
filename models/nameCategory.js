const mongoose = require("mongoose");

const NameCategorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NameTag",
    },
  ],
  order: Number,
  default: 0,
});

module.exports =
  mongoose.models["namecategory"] ||
  mongoose.model("namecategory", NameCategorySchema);
