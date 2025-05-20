const mongoose = require('mongoose');
require('dotenv').config();

// Test database connection
async function database_connection() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/parking_management_system');
        console.log('✅ MongoDB connection established successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
}

module.exports = {
    database_connection
};
