const mongoose = require('mongoose');
require('dotenv').config('.env');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
    console.log('Mongo DB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
