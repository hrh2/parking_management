const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    licensePlate: { 
        type: String, 
        required: true, 
        unique: true 
    },
    model: { 
        type: String 
    },
    color: { 
        type: String 
    },
    sits: { 
        type: Number 
    },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
    timestamps: true,
});


const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = {
    Vehicle
};
