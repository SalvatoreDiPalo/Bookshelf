import { AppDataSource } from "../data-source";
import { Author } from "../models/entity/Author";

const authorRepository = AppDataSource.getRepository(Author);

export const getAuthors = async (req, res) => {
  try {
    const authors = await authorRepository.find();
    res.json(authors);
  } catch (err) {
    res.status(500).send(err);
  }
};
