const mongoose = require("mongoose");

const IndividualTagSchema= new mongoose.Schema({
individualTag: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.models['individualTags'] || mongoose.model("individualTags", IndividualTagSchema);