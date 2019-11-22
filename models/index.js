const mongoose = require("mongoose");

// set debug to true to display db responses
mongoose.set("debug", true);
// enable promises for mongoose
mongoose.Promise = Promise;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
    keepAlive: true
  })
  .then(conn => console.log(`MongoDB Connected: ${conn.connection.host}`))
  .catch(error => console.log(error));

module.exports.Foo = require("./foo");
module.exports.User = require("./users");
module.exports.Post = require("./posts");
