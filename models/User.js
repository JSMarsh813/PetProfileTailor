const mongoose = require("mongoose");
import chooseRandomDefaultAvatar from "@/utils/chooseRandomDefaultAvatar";

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
        default: [],
        ref: "User",
      },
    ],
    blockedusers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
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
      default: chooseRandomDefaultAvatar,
      //why no () after chooseRandomDefaultAvatar?
      // Because Mongoose will call it for you every time it needs a default value, so you pass the function, not its result.
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
