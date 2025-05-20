const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const parkingSlotSchema = new mongoose.Schema({
    slotNumber: { 
        type: String, 
        required: true 
    },
    isAvailable: { 
        type: Boolean, 
        default: true 
    },
    station: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingStation' },
}, {
    timestamps: true,
});


const ParkingSlot = mongoose.model('ParkingSlot', parkingSlotSchema);

module.exports = { ParkingSlot };
