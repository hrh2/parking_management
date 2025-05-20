// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    slot:{ type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSlot', required: true },
    user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicle:{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    startTime: { 
        type: Date, 
        required: true 
    },
    endTime: { 
        type: Date, 
        required: false 
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'],
        default: 'PENDING',
    }
}, {
    timestamps: true,
});


const Booking = mongoose.model('Booking', bookingSchema);

module.exports = { Booking };
