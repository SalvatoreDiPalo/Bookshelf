import { celebrate, Joi } from "celebrate";

const publishersIdBody = celebrate({
  body: Joi.array().items(Joi.number()),
});

export { publishersIdBody };
