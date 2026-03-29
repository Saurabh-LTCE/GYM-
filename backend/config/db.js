const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MongoDB URI missing. Set MONGODB_URI in backend/.env');
    }

    const conn = await mongoose.connect(mongoUri, {
      // Add options here if needed (e.g., ssl settings for Atlas/Azure)
    });
    console.log(`✅MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;