const Joi = require("joi");

const paginationValidationSchema = {
  page: Joi.number().min(1),
  limit: Joi.number().min(1),
};

module.exports = paginationValidationSchema;
