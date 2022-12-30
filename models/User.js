const mongoose = require("mongoose");

const UserSchema= new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false,     
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }, 
  favnames: {
    type: Array,  
    default: [],
  },
  favbehaviors: {
    type: Array, 
    default: [],
  },

}, {timestamps:true})

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;


// module.exports = mongoose.models['users'] || mongoose.model("users", UserSchema);

//mongoose.models['test5'] needed to avoid " OverwriteModelError: Cannot overwrite `test5` model once compiled." axios error
//"test" will be what it appears as in mongodb as a collection