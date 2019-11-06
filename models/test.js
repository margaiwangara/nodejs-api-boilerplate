const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 150
  },
  surname: {
    type: String,
    required: false,
    maxlength: 150
  },
  email: {
    type: String,
    required: true,
    maxlength: 150,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Test = mongoose.model("Test", testSchema);

module.exports = Test;
