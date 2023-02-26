const mongoose = require("mongoose");

const namecommentSchema= new mongoose.Schema({
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
  replyingtothisid: {
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
  likedby: {
    type: Array,  
    default: [],
  }, 


}, {timestamps:true})

const namecomment= mongoose.models.namecomment|| mongoose.model('namecomment', namecommentSchema);
export default namecomment;
