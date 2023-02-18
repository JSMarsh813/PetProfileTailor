const mongoose = require("mongoose");

const NameCategorySchema= new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref:"NameTag"
  }]
})

module.exports = mongoose.models['NameCategory'] || mongoose.model("NameCategory", NameCategorySchema);
