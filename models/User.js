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
      required: false,
    },
    flaggedby: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],
    blockedusers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
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
      default: "https://placekitten.com/300/300",
    },
    passwordresettoken: {
      type: String,
      required: false,
    },
    resettokenexpires: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true },
  {
    strict: true,
    strictQuery: false, // Turn off strict mode for query filters
  },
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
