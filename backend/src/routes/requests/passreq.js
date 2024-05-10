const Joi = require('joi');

const schema = Joi.object({
    source: Joi.string().required(),
    password: Joi.string().required()
});

module.exports = schema