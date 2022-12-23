const mongoose = require("mongoose");

const UserSchema= new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'guest',    
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },

}, {timestamps:true})

module.exports = mongoose.models['users'] || mongoose.model("users", UserSchema);
//mongoose.models['test5'] needed to avoid " OverwriteModelError: Cannot overwrite `test5` model once compiled." axios error
//"test" will be what it appears as in mongodb as a collection