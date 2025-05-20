const {verifyToken} = require("../../../Middlewares/verifyToken");
const {Booking} = require("../../../Models/Booking");
const {ParkingSlot} = require("../../../Models/ParkingSlot");
const {ParkingStation} = require("../../../Models/ParkingStation");
const {Ticket} = require("../../../Models/Ticket");
const {User} = require("../../../Models/User");
const {extractUserIdFromToken} = require("../../Utils/extractors");
const {isAdmin} = require("../../Utils/helper");
const {sendEmail} = require("../../Utils/Mailer");
const router = require('express').Router();



router.post('/', verifyToken, async (req, res) => {
    try {
        const { slot, vehicle, startTime } = req.body;
        const userId = extractUserIdFromToken(req);

        if (!slot || !vehicle || !startTime) {
            return res.status(400).json({ message: 'Slot, vehicle, and start time are required.' });
        }

        // Find the slot to get its station
        const parkingSlot = await ParkingSlot.findById(slot);
        if (!parkingSlot) {
            return res.status(404).json({ message: 'Parking slot not found.' });
        }

        if (!parkingSlot.isAvailable) {
            return res.status(400).json({ message: 'Selected slot is not available.' });
        }

        // Create the booking
        const booking = new Booking({
            slot: parkingSlot._id,
            user: userId,
            vehicle,
            startTime: new Date(startTime),
            status: 'PENDING'
        });

        await booking.save();

        res.status(201).json({ message: 'Booking created and pending approval.', booking });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});


router.get('/', verifyToken, async (req, res) => {
    try {
        const bookings = await Booking.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

router.patch('/approve/:id', verifyToken, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ message: 'Only admins can approve/reject bookings.' });
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Update booking status
        booking.status = 'APPROVED';
        await booking.save();

        // Make slot unavailable
        const slot = await ParkingSlot.findById(booking.slot);
        slot.isAvailable = false;
        await slot.save();

        // Get user email for notification
        const user = await User.findById(booking.user);
        if (user && user.email) {
            // Send email notification
            try {
                await sendEmail(user.email, {
                    type: 'ALERT_MESSAGE',
                    message: `
                        <h1>Booking Approved</h1>
                        <p>Your booking request has been approved.</p>
                        <p>Booking Details:</p>
                        <ul>
                            <li>Start Time: ${new Date(booking.startTime).toLocaleString()}</li>
                            <li>Slot Number: ${slot.slotNumber}</li>
                        </ul>
                        <p>Thank you for using our parking service!</p>
                    `
                });
            } catch (emailError) {
                console.error('Failed to send email notification:', emailError);
                // Continue with the process even if email fails
            }
        }

        res.status(200).json({ message: 'Booking approved and slot marked as unavailable', booking });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});


router.patch('/reject/:id', verifyToken, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ message: 'Only admins can approve/reject bookings.' });
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        booking.status = 'REJECTED';
        await booking.save();

        // Get user email for notification
        const user = await User.findById(booking.user);
        if (user && user.email) {
            // Send email notification
            try {
                await sendEmail(user.email, {
                    type: 'ALERT_MESSAGE',
                    message: `
                        <h1>Booking Rejected</h1>
                        <p>We regret to inform you that your booking request has been rejected.</p>
                        <p>Please contact our support team for more information.</p>
                        <p>Thank you for your understanding.</p>
                    `
                });
            } catch (emailError) {
                console.error('Failed to send email notification:', emailError);
                // Continue with the process even if email fails
            }
        }

        res.status(200).json({ message: 'Booking rejected' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// New route to complete a booking
router.patch('/complete/:id', verifyToken, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ message: 'Only admins can complete bookings.' });
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.status !== 'APPROVED') {
            return res.status(400).json({ message: 'Only approved bookings can be completed.' });
        }

        // Set the end time to now
        booking.endTime = new Date();
        booking.status = 'COMPLETED';
        await booking.save();

        // Make slot available again
        const slot = await ParkingSlot.findById(booking.slot);
        slot.isAvailable = true;
        await slot.save();

        // Find the station to get the rate per minute
        const station = await ParkingStation.findById(slot.station);
        if (!station) {
            return res.status(404).json({ message: 'Parking station not found' });
        }

        // Calculate duration in minutes
        const startTime = new Date(booking.startTime);
        const endTime = new Date(booking.endTime);
        const durationMinutes = Math.ceil((endTime - startTime) / 60000); // Convert ms to minutes and round up

        // Calculate amount
        const amount = durationMinutes * station.ratePerMinute;

        // Create a ticket
        const ticket = new Ticket({
            user: booking.user,
            slot: booking.slot,
            vehicle: booking.vehicle,
            startTime: booking.startTime,
            endTime: booking.endTime,
            durationMinutes,
            amount,
            isPaid: false
        });

        await ticket.save();

        // Get user email for notification
        const user = await User.findById(booking.user);
        if (user && user.email) {
            // Send email notification
            try {
                await sendEmail(user.email, {
                    type: 'ALERT_MESSAGE',
                    message: `
                        <h1>Booking Completed</h1>
                        <p>Your booking has been marked as completed.</p>
                        <p>Booking Details:</p>
                        <ul>
                            <li>Start Time: ${startTime.toLocaleString()}</li>
                            <li>End Time: ${endTime.toLocaleString()}</li>
                            <li>Duration: ${durationMinutes} minutes</li>
                            <li>Amount: $${amount.toFixed(2)}</li>
                        </ul>
                        <p>Please proceed to payment.</p>
                        <p>Thank you for using our parking service!</p>
                    `
                });
            } catch (emailError) {
                console.error('Failed to send email notification:', emailError);
                // Continue with the process even if email fails
            }
        }

        res.status(200).json({ 
            message: 'Booking completed and ticket generated', 
            booking, 
            ticket 
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});


module.exports = router
