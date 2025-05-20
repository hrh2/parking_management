const mongoose = require('mongoose');

const parkingStationSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    location: { 
        type: String, 
        required: true 
    },
    ratePerMinute: {
        type: Number,
        required: true,
        default: 10 // or any default rate
    },
    slots:[{ type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSlot' }],
},
    {
        timestamps: true,
});

const ParkingStation = mongoose.model('ParkingStation', parkingStationSchema);

module.exports = {
     ParkingStation
};
