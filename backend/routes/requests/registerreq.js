const Joi = require("joi");

const schema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] }})
        .required(),
    username: Joi.string()
        .alphanum()
        .required(),
    password: Joi.string()
        .alphanum()
        .required()
});

module.exports = schema;