const mongoose = require('mongoose');
// const sql = require('mysql');

// set debug to true to display db responses
mongoose.set('debug', true);
// enable promises for mongoose
mongoose.Promise = Promise;

const MONGO_CONFIG = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
  keepAlive: true,
};

async function connectDB() {
  try {
    const MONGO_DEBUG = process.env.NODE_ENV !== 'production' ? true : false;
    const MONGO_URI =
      process.env.MONGO_URI === 'testing'
        ? process.env.MONGO_URI_TESTING
        : process.env.MONGO_URI;
    // DEBUG
    mongoose.set('debug', MONGO_DEBUG);
    const conn = await mongoose.connect(MONGO_URI, MONGO_CONFIG);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.bold);
  } catch (error) {
    console.log(error);
  }
}

module.exports = connectDB;
