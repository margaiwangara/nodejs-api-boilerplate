const mongoose = require("mongoose");
const sql = require("mysql");

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
  .then(conn =>
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.bold)
  )
  .catch(error => console.log(error));

// SQL DB Configuration
const connection = sql.createConnection({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DB
});

connection.connect(error => {
  if (error) console.log(error);
  console.log("Connection to SQL DB Successfull".cyan.bold);
});

module.exports.Foo = require("./foo");
module.exports.User = require("./users");
module.exports.Post = require("./posts");
