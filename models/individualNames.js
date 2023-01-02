const { faBullseye } = require("@fortawesome/free-solid-svg-icons");
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
  likedby: {
    type:Array,
    required:true,
    default: [],
    unique:false,
  },
  createdby:{
    type: String,
    required: false,
  }
})

// Apply the uniqueValidator plugin to userSchema.
IndividualNameSchema.plugin(uniqueValidator);

module.exports = mongoose.models['names'] || mongoose.model("names", IndividualNameSchema);

  // addedBy:{
  //   type: String,
  //   required: true,
  //   unique: true,
  // }