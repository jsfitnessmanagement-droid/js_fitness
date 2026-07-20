const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/js_fitness_test_db');
  } catch (err) {
    console.error(err);
  }
};

const closeDB = async () => {
  await mongoose.connection.close();
};

const clearDB = async () => {
  if(mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
};

module.exports = { connectDB, closeDB, clearDB };
