// const cron = require('node-cron');
// const { Booking } = require('../Models/Booking');
// const { ParkingSlot } = require('../Models/ParkingSlot');
// const { Ticket } = require('../Models/Ticket');
// const { ParkingStation } = require('../Models/ParkingStation');
// const { User } = require('../Models/User');
// const { Op } = require('sequelize');
// const { v4: uuidv4 } = require('uuid');
//
// // Run every minute
// cron.schedule('* * * * *', async () => {
//     try {
//         console.log('⏰ Cron Job Running: Checking expired bookings...');
//
//         const now = new Date();
//
//         // 1. Get expired & approved bookings
//         const expiredBookings = await Booking.findAll({
//             where: {
//                 endTime: { [Op.lte]: now },
//                 status: 'APPROVED',
//             }
//         });
//
//         for (const booking of expiredBookings) {
//             // Update booking status to EXPIRED
//             booking.status = 'EXPIRED';
//             await booking.save();
//
//             // Free up the slot
//             const slot = await ParkingSlot.findByPk(booking.slotId);
//             if (slot) {
//                 slot.isAvailable = true;
//                 await slot.save();
//             }
//
//             // Check if ticket already exists
//             const ticketExists = await Ticket.findOne({ where: { bookingId: booking.id } });
//             if (!ticketExists) {
//                 // Get station to access its rate
//                 const station = await ParkingStation.findByPk(booking.stationId);
//                 const user = await User.findByPk(booking.userId);
//
//                 if (station) {
//                     const durationMinutes = Math.ceil((booking.endTime - booking.startTime) / (1000 * 60));
//                     const amount = durationMinutes * station.ratePerMinute;
//
//                     // Create ticket
//                     await Ticket.create({
//                         id: uuidv4(),
//                         bookingId: booking.id,
//                         userId: user.id,
//                         stationId: station.id,
//                         slotId: slot.id,
//                         startTime: booking.startTime,
//                         endTime: booking.endTime,
//                         durationMinutes,
//                         amount,
//                         isPaid: false,
//                     });
//
//                     console.log(`🎟️ Ticket generated for booking: ${booking.id}`);
//                 }
//             }
//         }
//
//     } catch (err) {
//         console.error('❌ Cron Job Error:', err.message);
//     }
// });
