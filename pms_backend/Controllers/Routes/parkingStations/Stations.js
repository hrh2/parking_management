const express = require('express');
const {verifyToken} = require("../../../Middlewares/verifyToken");
const {extractRoledFromToken} = require("../../Utils/extractors");
const {ParkingStation} = require("../../../Models/ParkingStation");
const {ParkingSlot} = require("../../../Models/ParkingSlot");
const {isAdmin} = require("../../Utils/helper");
const mongoose = require("mongoose");
const router = express.Router();



// POST /stations - Create station + auto-generate slots
router.post('/', verifyToken, async (req, res) => {
    try {
        const role = extractRoledFromToken(req);
        if (role !== 'ADMIN') {
            return res.status(403).json({ message: 'Only admins can create stations.' });
        }

        const { name, location, ratePerMinute, slotCount } = req.body;

        if (!name || !location || !slotCount || !ratePerMinute || slotCount <= 0) {
            return res.status(400).json({ message: 'Name, location, ratePerMinute and valid slotCount are required.' });
        }

        // Create the station
        const station = new ParkingStation({ 
            name, 
            location, 
            ratePerMinute,
            slots: [] 
        });
        await station.save();

        // Generate slots
        const slotPromises = [];
        for (let i = 1; i <= slotCount; i++) {
            const slot = new ParkingSlot({
                slotNumber: `SLOT-${i}`,
                station: station._id
            });
            slotPromises.push(slot.save());
            station.slots.push(slot._id);
        }

        await Promise.all(slotPromises);
        await station.save();

        res.status(201).json({ message: 'Parking station created with slots.', station });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
});


// 2. GET /stations - List all stations
router.get('/', verifyToken, async (req, res) => {
    try {
        const stations = await ParkingStation.find()
            .populate({
                path: 'slots',
                select: 'slotNumber isAvailable'
            });

        res.status(200).json(stations);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error.', error: err.message });
    }
});

// 3. GET /stations/:id - Get specific station with its slots
router.get('/:id', verifyToken, async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Station ID' });
        }

        const station = await ParkingStation.findById(req.params.id)
            .populate({
                path: 'slots',
                select: 'slotNumber isAvailable'
            });

        if (!station) {
            return res.status(404).json({ message: 'Station not found.' });
        }

        res.status(200).json(station);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error.', error: err.message });
    }
});

// 4. PUT /stations/:id - Update station name or location
router.put('/:id', verifyToken, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ message: 'Only admins can update stations.' });
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Station ID' });
        }

        const { name, location, ratePerMinute } = req.body;
        const station = await ParkingStation.findById(req.params.id);

        if (!station) {
            return res.status(404).json({ message: 'Station not found.' });
        }

        if (name) station.name = name;
        if (location) station.location = location;
        if (ratePerMinute) station.ratePerMinute = ratePerMinute;

        await station.save();

        res.status(200).json({ message: 'Station updated.', station });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error.', error: err.message });
    }
});

// 5. DELETE /stations/:id - Delete station and its slots
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ message: 'Only admins can delete stations.' });
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Station ID' });
        }

        const station = await ParkingStation.findById(req.params.id);
        if (!station) {
            return res.status(404).json({ message: 'Station not found.' });
        }

        // Delete all associated slots first
        await ParkingSlot.deleteMany({ station: station._id });

        // Then delete the station
        await ParkingStation.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Station and related slots deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error.', error: err.message });
    }
});

module.exports = router;
