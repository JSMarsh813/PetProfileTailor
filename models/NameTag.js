const mongoose = require("mongoose");

const NameTagSchema= new mongoose.Schema({
tag: {
    type: String,
    required: true,
  },
  createdby:{
    type:String,
    default:"",
  }
})

const NameTag = mongoose.models.NameTag || mongoose.model('NameTag', NameTagSchema);
export default NameTag;