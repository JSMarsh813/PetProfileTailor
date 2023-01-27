const mongoose = require("mongoose");

const batSignalCommentSchema= new mongoose.Schema({
  image: {
    type: Array,
    required: false,
    unique: false,     
  },  
  description: {
    type: String,
    required: true,
    unique: false,
  },
  postid: {
    type: String,
    required: true,
    unique: false,
  },
  createdby: {
    type: String,
    required: true,
    ref: 'User',
  }, 
  shares: {
    type: Array,  
    default: [],
  }, 
  parentcommentid: {
    type: String,  
    default: null,
  }, 
  likes: {
    type: Array,  
    default: [],
  }, 


}, {timestamps:true})

const BatSignalComment= mongoose.models.BatSignalComment|| mongoose.model('BatSignalComment', batSignalCommentSchema);
export default BatSignalComment;

 // favnames: {
  //   type: Array,  
  //   default: [],
  // },
  // favbehaviors: {
  //   type: Array, 
  //   default: [],
  // },

// module.exports = mongoose.models['users'] || mongoose.model("users", UserSchema);

//mongoose.models['test5'] needed to avoid " OverwriteModelError: Cannot overwrite `test5` model once compiled." axios error
//"test" will be what it appears as in mongodb as a collection