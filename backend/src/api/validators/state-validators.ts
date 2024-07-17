import { celebrate, Joi } from "celebrate";

const multipleStatesBody = celebrate({
  body: Joi.array().unique().items({
    id: Joi.number().optional(),
    name: Joi.string().required(),
    isEditable: Joi.boolean().required(),
  }),
});

export { multipleStatesBody };
