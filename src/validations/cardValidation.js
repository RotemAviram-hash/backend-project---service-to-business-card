import Joi from "joi";

const cardSchema = Joi.object({
  title: Joi.string().min(2).max(256).required(),

  subtitle: Joi.string().min(2).max(256).required(),

  description: Joi.string().min(2).max(1024).required(),

  phone: Joi.string().required(),

  email: Joi.string().email().required(),

  web: Joi.string().allow("").optional(),

  image: Joi.object({
    url: Joi.string().uri().allow("").optional(),
    alt: Joi.string().allow("").optional(),
  }).optional(),

  address: Joi.object({
    state: Joi.string().allow("").optional(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    street: Joi.string().required(),
    houseNumber: Joi.number().integer().min(1).required(),
    zip: Joi.number().integer().min(0).optional(),
  }).required(),

  bizNumber: Joi.number().required(),
});

export default cardSchema;
