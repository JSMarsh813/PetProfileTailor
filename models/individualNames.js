const mongoose = require("mongoose");

const IndividualNameSchema= new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description:{
    type:Array,
    required: false,
  },
  tags:{
    type: Array,
    required: true,
  }
})

module.exports = mongoose.models['names'] || mongoose.model("names", IndividualNameSchema);