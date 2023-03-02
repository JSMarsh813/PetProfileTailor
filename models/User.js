const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
    },
    profilename: {
      type: String,
      required: true,
      unique: true,
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
    blockedusers: {
      type: Array,
      default: [],
    },
    followers: {
      type: Array,
      default: [],
      ref: "User",
    },
    bioblurb: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      required: false,
      default: "",
    },
    profileimage: {
      type: String,
      default: "http://placekitten.com/300/300",
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;

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
