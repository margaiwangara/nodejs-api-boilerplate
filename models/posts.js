const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: [255, "You have exceeded the max title length[255]"],
      required: [true, "Title field is required"],
      unique: true
    },
    content: {
      type: String,
      required: [true, "Body field is required"]
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: [true, "User field is required"]
    }
  },
  {
    timestamps: true
  }
);

const Post = mongoose.model("Posts", postSchema);

module.exports = Post;
