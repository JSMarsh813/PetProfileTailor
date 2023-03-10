const mongoose = require("mongoose");

const CategoryCollectionSchema= new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  tags: {
    type: Array,
    required: true,
  }
})

module.exports = mongoose.models['test5'] || mongoose.model("test5", CategoryCollectionSchema);
//mongoose.models['test5'] needed to avoid " OverwriteModelError: Cannot overwrite `test5` model once compiled." axios error
//"test" will be what it appears as in mongodb as a collection