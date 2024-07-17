import { celebrate, Joi } from "celebrate";

const authorsIdBody = celebrate({
  body: Joi.array().items(Joi.number()),
});

export { authorsIdBody };
