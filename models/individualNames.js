const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const IndividualNameSchema= new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description:{
    type:Array,
    required: false,
  },
  tags:{
    type: Array,
    required: true,
  },

})

// Apply the uniqueValidator plugin to userSchema.
IndividualNameSchema.plugin(uniqueValidator);

module.exports = mongoose.models['names'] || mongoose.model("names", IndividualNameSchema);

  // addedBy:{
  //   type: String,
  //   required: true,
  //   unique: true,
  // }