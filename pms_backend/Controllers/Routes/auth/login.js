const router = require('express').Router();
const { User } = require('../../../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validateOnLogin} = require("../../../validators/UserValidator");
const {sendEmail} = require("../../Utils/Mailer");
const {generateToken} = require("../../Utils/generateToken");
const {validateOneTimeCode} = require("../../Utils/otpManager");
require('dotenv').config();

router.post('/', async (req, res) => {
    try {
        const { error } = validateOnLogin(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        // Remove whitespace from email/phone input
        const email_phone = req.body.email_phone.replace(/\s/g, "");
        // Check if email_phone contains only digits (valid phone number)
        const isNumeric = /^\d+$/.test(email_phone);
        let user;
        if (isNumeric) {
            user = await User.findOne({ phone: parseInt(email_phone) });
        } else {
            user = await User.findOne({ email: email_phone });
        }
        if (!user) return res.status(401).json({ message: 'Invalid Email/Phone or Password' });

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(401).json({ message: 'Invalid Email/Phone or Password' });

        await sendEmail(user.email, { type: 'LOGIN_OTP', message: "" });

        return res.status(201).json({ message: "Successfully Logged. We sent a verification code to your email."});

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/otp', async (req, res) => {
    try {
        const { email, verificationCode } = req.body;

        if (!email || !verificationCode) {
            return res.status(400).json({ message: "Email and verification code are required." });
        }

        const existingUser = await User.findOne({ email:email });

        if (!existingUser) {
            return res.status(400).json({ message: "User not Found." });
        }
        // Validate the one-time code
        const { valid, message } = await validateOneTimeCode(email, verificationCode);

        if (!valid) {
            return res.status(400).json({ message });
        }


        const token = generateToken(existingUser)

        return res.status(201).json({ message: "success", token:token });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error Error: " + err.message });
    }
});


module.exports = router;