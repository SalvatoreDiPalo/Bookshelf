import { celebrate, Joi } from "celebrate";

const isbnParam = celebrate({
  params: {
    isbn: Joi.string().required(),
  },
});

const searchQuery = celebrate({
  query: {
    page: Joi.number().positive().default(1),
    pageSize: Joi.number().positive().default(20),
    sortBy: Joi.string().default("title"),
    isFavorite: Joi.boolean().optional(),
    stateId: Joi.number().positive().optional(),
  },
});

const isFavoriteQuery = celebrate({
  query: {
    isFavorite: Joi.boolean().required(),
  },
});

const isbnAndStateIdParams = celebrate({
  params: {
    isbn: Joi.string().required(),
    stateId: Joi.number().positive().required(),
  },
});

export { isbnParam, searchQuery, isFavoriteQuery, isbnAndStateIdParams };
