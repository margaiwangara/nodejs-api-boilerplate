const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors/safe");

// config for colors
const failure = colors.red.bold;
const success = colors.green.bold;

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
const Foo = require("../models/foo");
// Function to acquire data and add to db
const seedFooCollection = async () => {
  try {
    let data = fs.readFileSync(`${__dirname}/../_data/foo.json`);

    // save data
    await Foo.create(JSON.parse(data));

    // successfull response
    console.log(success("Foo collection seeded successfully"));
    // exit process
    process.exit();
  } catch (error) {
    console.log(failure(error));
  }
};

const emptyFooCollection = async () => {
  try {
    await Foo.deleteMany();

    console.log(success("Foo collection emptied successfully"));
    // exit process
    process.exit();
  } catch (error) {
    console.log(failure(error));
  }
};
// check if seeding tag is added '-c for creation and -d for deletion'
if (process.argv[2] === "-c") {
  seedFooCollection();
} else if (process.argv[2] === "-d") {
  emptyFooCollection();
}
