const express = require("express");
const { verifyToken } = require("../../../Middlewares/verifyToken");
const { User } = require("../../../Models/User");
const { Vehicle } = require("../../../Models/Vehicle");
const { Ticket } = require("../../../Models/Ticket");
const { isAdmin } = require("../../Utils/helper");
const router = express.Router();


router.get("/", verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (!isAdmin(req)) {
      return res.status(403).json({ message: "Only admins can access reports." });
    }

    // Get current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate total users
    const totalUsers = await User.countDocuments();

    // Calculate new users registered today
    const newUsers = await User.countDocuments({
      createdAt: { $gte: today }
    });

    // Calculate verified users
    const verifiedUsers = await User.countDocuments({ isVerified: true });

    // Calculate total revenue
    const tickets = await Ticket.find();
    const totalRevenue = tickets.reduce((sum, ticket) => sum + ticket.amount, 0);

    // Calculate monthly revenue
    const monthlyRevenue = {};
    tickets.forEach(ticket => {
      const month = ticket.createdAt.getMonth();
      const year = ticket.createdAt.getFullYear();
      const key = `${year}-${month + 1}`;
      
      if (!monthlyRevenue[key]) {
        monthlyRevenue[key] = 0;
      }
      
      monthlyRevenue[key] += ticket.amount;
    });

    // Calculate total vehicles
    const totalVehicles = await Vehicle.countDocuments();

    // Calculate new clients today
    const newClientsToday = await User.countDocuments({
      createdAt: { $gte: today },
      role: "STANDARD"
    });

    // Return report data
    return res.status(200).json({
      totalUsers,
      newUsers,
      verifiedUsers,
      totalRevenue,
      monthlyRevenue,
      totalVehicles,
      newClientsToday,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

module.exports = router;