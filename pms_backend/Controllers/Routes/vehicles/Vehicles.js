const express = require('express');
const {verifyToken} = require("../../../Middlewares/verifyToken");
const {extractUserIdFromToken} = require("../../Utils/extractors");
const {Vehicle} = require("../../../Models/Vehicle");
const mongoose = require("mongoose");
const router = express.Router();

// POST /vehicles - Add a new vehicle
router.post('/', verifyToken, async (req, res) => {
    try {
        const ownerId = extractUserIdFromToken(req);
        const { licensePlate, model, color, sits } = req.body;

        if (!licensePlate) {
            return res.status(400).json({ message: 'License plate is required.' });
        }

        const vehicle = new Vehicle({
            licensePlate,
            model,
            color,
            sits,
            ownerId
        });

        await vehicle.save();

        res.status(201).json({ message: 'Vehicle added successfully.', vehicle });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /vehicles - Get all vehicles of the authenticated user
router.get('/', verifyToken, async (req, res) => {
    try {
        const ownerId = extractUserIdFromToken(req);
        const vehicles = await Vehicle.find({ ownerId });

        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /vehicles/:id - Get a single vehicle
router.get('/:id', verifyToken, async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Vehicle ID' });
        }

        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found.' });
        }
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
});

// PUT /vehicles/:id - Update a vehicle
router.put('/:id', verifyToken, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Vehicle ID' });
        }

        const ownerId = extractUserIdFromToken(req);
        const { licensePlate, model, color, sits } = req.body;

        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found.' });
        }

        if (vehicle.ownerId.toString() !== ownerId) {
            return res.status(403).json({ message: 'Unauthorized to update this vehicle.' });
        }

        const updatedVehicle = await Vehicle.findByIdAndUpdate(
            req.params.id, 
            { licensePlate, model, color, sits },
            { new: true }
        );

        res.status(200).json({ message: 'Vehicle updated successfully.', vehicle: updatedVehicle });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
});

// DELETE /vehicles/:id - Delete a vehicle
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const ownerId = extractUserIdFromToken(req);
        const vehicle = await Vehicle.findById(req.params.id);

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Vehicle ID' });
        }

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found.' });
        }

        if (vehicle.ownerId.toString() !== ownerId) {
            return res.status(403).json({ message: 'Unauthorized to delete this vehicle.' });
        }

        await Vehicle.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Vehicle deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
