const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const NameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: Array,
    required: false,
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "NameTag",
    },
  ],
  comments: {
    type: Array,
  },
  flaggedby: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  likedby: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdby: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "User",
  },
});

// Apply the uniqueValidator plugin to userSchema.
NameSchema.plugin(uniqueValidator);

module.exports = mongoose.models?.names || mongoose.model("names", NameSchema);
