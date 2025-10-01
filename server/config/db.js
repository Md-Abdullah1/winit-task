const mongoose = require("mongoose");

async function connectToDatabase() {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/winit";
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri, { 
    autoIndex: true
  });
  return mongoose.connection;
}

module.exports = { connectToDatabase };


