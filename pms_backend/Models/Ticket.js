// models/Ticket.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    slot:{ type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSlot', required: true },
    vehicle:{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    startTime: { 
        type: Date, 
        required: true 
    },
    endTime: { 
        type: Date, 
        required: true 
    },
    durationMinutes: { 
        type: Number, 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    isPaid: { 
        type: Boolean, 
        default: false 
    }
}, {
    timestamps: true
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = { Ticket };
