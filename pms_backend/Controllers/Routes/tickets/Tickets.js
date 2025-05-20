const express = require("express");
const {verifyToken} = require("../../../Middlewares/verifyToken");
const {Ticket} = require("../../../Models/Ticket");
const {Booking} = require("../../../Models/Booking");
const {User} = require("../../../Models/User");
const {isAdmin} = require("../../Utils/helper");
const {extractUserIdFromToken} = require("../../Utils/extractors");
const {sendEmail} = require("../../Utils/Mailer");
const router = express.Router();


router.get('/', verifyToken, async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ message: 'Only admins can read all tickets.' });
        }
        const tickets = await Ticket.find().sort({ createdAt: -1 });
        return res.status(200).json(tickets);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

router.get('/my',verifyToken,  async (req, res) => {
    try {
        const userId = extractUserIdFromToken(req);

        const tickets = await Ticket.find({ user: userId }).populate('user slot vehicle').sort({ createdAt: -1 });

        res.status(200).json(tickets);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Add a route to get user's bookings
router.get('/my-bookings', verifyToken, async (req, res) => {
    try {
        const userId = extractUserIdFromToken(req);

        const bookings = await Booking.find({ user: userId }).sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

router.patch('/pay/:id', verifyToken, async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Ticket ID' });
        }

        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        // Ensure the user can only pay for their own tickets unless they're an admin
        const userId = extractUserIdFromToken(req);
        if (ticket.user.toString() !== userId && !isAdmin(req)) {
            return res.status(403).json({ message: 'You can only pay for your own tickets.' });
        }

        if (ticket.isPaid) {
            return res.status(400).json({ message: 'Ticket already paid.' });
        }

        ticket.isPaid = true;
        await ticket.save();

        // Get user email for notification
        const user = await User.findById(ticket.user);
        if (user && user.email) {
            // Send email notification
            try {
                await sendEmail(user.email, {
                    type: 'ALERT_MESSAGE',
                    message: `
                        <h1>Payment Successful</h1>
                        <p>Your payment for the parking ticket has been processed successfully.</p>
                        <p>Ticket Details:</p>
                        <ul>
                            <li>Start Time: ${new Date(ticket.startTime).toLocaleString()}</li>
                            <li>End Time: ${new Date(ticket.endTime).toLocaleString()}</li>
                            <li>Duration: ${ticket.durationMinutes} minutes</li>
                            <li>Amount Paid: $${ticket.amount.toFixed(2)} FRW</li>
                        </ul>
                        <p>Thank you for using our parking service!</p>
                    `
                });
            } catch (emailError) {
                console.error('Failed to send email notification:', emailError);
                // Continue with the process even if email fails
            }
        }

        res.status(200).json({ message: '✅ Ticket paid successfully', ticket });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});



module.exports=router;
