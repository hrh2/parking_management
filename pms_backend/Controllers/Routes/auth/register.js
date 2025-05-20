const router = require('express').Router();
const { User } = require('../../../Models/User'); // Sequelize User model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {sendEmail} = require("../../Utils/Mailer");
const {validateUser} = require("../../../validators/UserValidator");
require('dotenv').config();

router.post('/', async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Check if email or phone number is already in use
        const existingUser = await User.findOne({ email: req.body.email });
        const existingUserByPhone = await User.findOne({ phone: req.body.phone });

        if (existingUser) {
            return res.status(400).json({ message: 'That email is already in use.' });
        }

        if (existingUserByPhone) {
            return res.status(400).json({ message: 'That phone number is already in use.' });
        }

        // Send verification email first (can be reversed if preferred)
        await sendEmail(req.body.email,{type:'INITIAL_VERIFICATION',message:''});
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);


        // Create user
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword,
            isVerified: false,
        });

        await user.save();

        return res.status(200).json({message: 'Validation code sent. Check your email.' });

    } catch (err) {

        return res.status(500).json({ message: err.message });

    }
});

module.exports = router;
