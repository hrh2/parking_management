const Joi = require('joi');

const ParkingStationValidator= (data) => {
    const schema = Joi.object({
        name: Joi.string().required().label('Station  Name'),
        location: Joi.string().required().label('Station Location'),
    });
    return schema.validate(data);
};


module.exports = {ParkingStationValidator};