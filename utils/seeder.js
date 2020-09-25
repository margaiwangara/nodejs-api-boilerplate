const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors/safe");

// config for colors
const failure = colors.red.bold;
const success = colors.green.inverse;

// configure dotenv
dotenv.config({ path: `${__dirname}/../config/config.env` });

// Connect Mongoose
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
    keepAlive: true
  })
  .then(conn => console.log(`MongoDB Connected: ${conn.connection.host}`))
  .catch(error => console.log(error));

// Initialize DB
const db = require("../models");
// Function to acquire data and add to db
const seedCollections = async () => {
  try {
    let fooData = fs.readFileSync(`${__dirname}/../_data/foo.json`, "utf-8"),
      userData = fs.readFileSync(`${__dirname}/../_data/users.json`, "utf-8"),
      postData = fs.readFileSync(`${__dirname}/../_data/posts.json`, "utf-8");

    // save data
    await db.User.create(JSON.parse(userData));
    await db.Foo.create(JSON.parse(fooData));
    await db.Post.create(JSON.parse(postData));

    // successfull response
    console.log(success("Collections seeded successfully"));
    // exit process
    process.exit();
  } catch (error) {
    console.log(failure(error));
  }
};

const emptyCollections = async () => {
  try {
    await db.User.deleteMany();
    await db.Foo.deleteMany();
    await db.Post.deleteMany();

    console.log(success("Collections emptied successfully"));
    // exit process
    process.exit();
  } catch (error) {
    console.log(failure(error));
  }
};
// check if seeding tag is added '-c for creation and -d for deletion'
if (process.argv[2] === "-c") {
  seedCollections();
} else if (process.argv[2] === "-d") {
  emptyCollections();
}
