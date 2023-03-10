const mongoose = require("mongoose");
import { Schema } from 'mongoose'

const PostSchema= new mongoose.Schema({
  image: {
    type: Array,
    required: false,
    unique: false,     
  },
  title: {
    type: String,
    required: false,
    unique: false,     
  },
  description: {
    type: String,
    required: true,
    unique: false,
  },
  createdby: {
    type: String,
    required: true,
    ref: 'User',
  }, 
   comments: [{
    type: Schema.Types.ObjectId,
    ref: 'BatSignalComment',
  }
], 
  shares: {
    type: Array,  
    default: [],
  }, 
  likedby: {
    type: Array,  
    default: [],
  }, 
  taglist:{
    type:Array,
    required: true,
  }

}, {timestamps:true})

const Post = mongoose.models.Posts || mongoose.model('Posts', PostSchema);
export default Post;

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