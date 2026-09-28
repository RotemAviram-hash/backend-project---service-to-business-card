import Joi from "joi";

const userValidation = Joi.object({
  name: Joi.object({
    first: Joi.string().min(2).max(256).required(),
    middle: Joi.string().allow("").default(""),
    last: Joi.string().min(2).max(256).required(),
  }).required(),

  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),

  image: Joi.object({
    url: Joi.string().uri(),
    alt: Joi.string(),
  }),

  address: Joi.object({
    state: Joi.string().default("not defined"),
    country: Joi.string().required(),
    city: Joi.string().required(),
    street: Joi.string().required(),
    houseNumber: Joi.number().min(1).required(),
    zip: Joi.number().default(0),
  }).required(),
}).required();

const businessStatusValidation = Joi.object({
  isBusiness: Joi.boolean().required(),
});

export { userValidation, businessStatusValidation };
