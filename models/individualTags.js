const mongoose = require("mongoose");

const IndividualTagSchema= new mongoose.Schema({
individualTag: {
    type: String,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  }
})

module.exports = mongoose.models['individualtags'] || mongoose.model("individualtags", IndividualTagSchema);