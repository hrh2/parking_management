const mongoose = require('mongoose');

const oneTimeCodeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const OneTimeCode = mongoose.model('OneTimeCode', oneTimeCodeSchema);

module.exports = { OneTimeCode };
