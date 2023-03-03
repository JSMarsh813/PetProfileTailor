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
