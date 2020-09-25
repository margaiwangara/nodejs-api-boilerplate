const mongoose = require("mongoose");

const fooSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 150
  },
  surname: {
    type: String,
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

const Foo = mongoose.model("Foo", fooSchema);

module.exports = Foo;
