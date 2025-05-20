const express = require('express');
const {verifyToken} = require("../../../Middlewares/verifyToken");
const {isAdmin} = require("../../Utils/helper");
const {ParkingStation} = require("../../../Models/ParkingStation");
const {ParkingSlot} = require("../../../Models/ParkingSlot");
const mongoose = require("mongoose");
const router = express.Router();



// 1. POST /slots - Add one slot manually to a station
router.post('/', verifyToken, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ message: 'Only admins can create slots.' });
        }

        const { stationId, slotNumber } = req.body;

        if (!stationId || !slotNumber) {
            return res.status(400).json({ message: 'Station ID and slot number are required.' });
        }

        const station = await ParkingStation.findById(stationId);
        if (!station) {
            return res.status(404).json({ message: 'Parking station not found.' });
        }

        const slot = new ParkingSlot({
            station: stationId,
            slotNumber,
            isAvailable: true,
        });

        await slot.save();

        // Update the station to include this slot
        station.slots.push(slot._id);
        await station.save();

        res.status(201).json({ message: 'Slot created successfully.', slot });

    } catch (err) {
        res.status(500).json({ message: 'Internal server error.', error: err.message });
    }
});

// 2. GET /slots - Get available slots (with optional stationId filter and pagination)

router.get('/', verifyToken, async (req, res) => {
    try {
        const { stationId, page = 1, limit = 10 } = req.query;

        if(stationId){
            if (!mongoose.Types.ObjectId.isValid(stationId)) {
                return res.status(400).json({ message: 'Invalid Station ID' });
            }
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const filter = {
            isAvailable: true,
            ...(stationId && { station: stationId })
        };

        const total = await ParkingSlot.countDocuments(filter);
        const slots = await ParkingSlot.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ slotNumber: 1 })
            .populate('station', 'name location');

        res.status(200).json({
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalSlots: total,
            slots
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error.', error: err.message });
    }
});


// 3. GET /slots/:id - Get a specific slot
router.get('/:id', verifyToken, async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Parking Slot ID' });
        }

        const slot = await ParkingSlot.findById(req.params.id)
            .populate('station', 'name location ratePerMinute');

        if (!slot) {
            return res.status(404).json({ message: 'Slot not found.' });
        }

        res.status(200).json(slot);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error.', error: err.message });
    }
});

// 4. PUT /slots/:id - Update slot info (slotNumber, availability)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ message: 'Only admins can update slots.' });
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Parking Slot ID' });
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Station ID' });
        }

        const { slotNumber, isAvailable } = req.body;
        const slot = await ParkingSlot.findById(req.params.id);

        if (!slot) {
            return res.status(404).json({ message: 'Slot not found.' });
        }

        if (slotNumber) slot.slotNumber = slotNumber;
        if (typeof isAvailable === 'boolean') slot.isAvailable = isAvailable;

        await slot.save();

        res.status(200).json({ message: 'Slot updated successfully.', slot });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error.', error: err.message });
    }
});

// 5. DELETE /slots/:id - Delete a single slot
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ message: 'Only admins can delete slots.' });
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Parking Slot ID' });
        }

        const slot = await ParkingSlot.findById(req.params.id);
        if (!slot) {
            return res.status(404).json({ message: 'Slot not found.' });
        }

        await slot.deleteOne();
        res.status(200).json({ message: 'Slot deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error.', error: err.message });
    }
});

module.exports = router;
