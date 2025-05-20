const {extractRoledFromToken} = require("./extractors");


const isAdmin = (req) => extractRoledFromToken(req) === 'ADMIN';


module.exports = {isAdmin}