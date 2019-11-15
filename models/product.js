const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      maxlength: 255,
      trim: true,
      required: true
    },
    slug: String,
    price: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Products", productSchema);

module.exports = Product;
