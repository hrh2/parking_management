const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: {
        type: String,
        required: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    password: { 
        type: String, 
        required: true 
    },
    role: {
        type: String,
        enum: ['ADMIN', 'STANDARD'],
        default: 'STANDARD',
        required: true
    },
    Vehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }],
    Tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
    Booking: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});


const User = mongoose.model('User', userSchema);

module.exports = {
   User
};
