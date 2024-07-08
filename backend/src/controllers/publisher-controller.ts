import { AppDataSource } from "../data-source";
import { Publisher } from "../models/entity/Publisher";

const publisherRepository = AppDataSource.getRepository(Publisher);

export const getPublishers = async (req, res) => {
  try {
    const publishers = await publisherRepository.find();
    res.json(publishers);
  } catch (err) {
    res.status(500).send(err);
  }
};
