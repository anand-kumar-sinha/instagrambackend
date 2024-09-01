const mongoose = require("mongoose");

const userModel = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Name"],
    },
    email: {
      type: String,
      required: [true, "Please Enter your email"],
      unique: true,
    },
    username: {
      type: String,
      required: [true, "Please Enter your username"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please Enter your password"],
    },
    tages: {
      type: String,
    },
    bio: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    link: {
      type: String,
    },
    avatar: {
      type: String,
      default:
        "https://firebasestorage.googleapis.com/v0/b/leafy-beach-388109.appspot.com/o/files%2F65edb6f18a79f4b2ed9a3596?alt=media&token=21fe8308-fa56-4cd6-9f0a-b27270e40901",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    status: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userModel);

module.exports = User;
