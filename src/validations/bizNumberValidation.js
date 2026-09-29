import Joi from "joi";

const bizNumberSchema = Joi.object({
  bizNumber: Joi.number().required(),
});

export default bizNumberSchema;
