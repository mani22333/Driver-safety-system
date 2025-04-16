// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/driver_safety', {
      useNewUrlParser: true,
      // ❌ Don't use `useUnifiedTopology` in Mongoose v6+
    });
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Optional: Exit app on failure
  }
};

module.exports = connectDB;
