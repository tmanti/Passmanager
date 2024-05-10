const Joi = require('joi');

const schema = Joi.object({
    source: Joi.string(),
    password: Joi.string()
});

module.exports = schema