const Joi = require("joi");

const schema = Joi.object({
    username: Joi.string().alphanum().required(),
    password: Joi.string().alphanum().required()
});

module.exports = schema;