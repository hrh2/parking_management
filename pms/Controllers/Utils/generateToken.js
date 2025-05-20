const jwt = require("jsonwebtoken");

function pg_generateToken(user) {
    const user_token_object = user.get({ plain: true });
    delete user_token_object.password; // Remove password field for safety

    // Generate JWT
    return jwt.sign(
        user_token_object,
        process.env.SECRET_KEY,
        {expiresIn: '1h'}
    );
}

function generateToken(user) {
    const user_token_object = user.toObject();
    user_token_object.password = "";

    // Generate JWT
    return jwt.sign(
        user_token_object,
        process.env.SECRET_KEY,
        {expiresIn: '1h'}
    );
}

module.exports = {generateToken};