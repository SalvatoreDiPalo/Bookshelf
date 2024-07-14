import { DataSource } from "typeorm";
import Container from "typedi";
import LoggerInstance from "./logger";
import { Author } from "../models/entity/Author-entity";
import { Publisher } from "../models/entity/Publisher-entity";
import { User } from "../models/entity/User-entity";
import { State } from "../models/entity/State-entity";
import { Book } from "../models/entity/Book-entity";

export const dependencyInjectorLoader = (dataSource: DataSource) => {
  try {
    const bookRepository = dataSource.getRepository(Book).extend({});
    Container.set("BookRepository", bookRepository);

    const authorRepository = dataSource.getRepository(Author).extend({});
    Container.set("AuthorRepository", authorRepository);

    const publisherRepository = dataSource.getRepository(Publisher).extend({});
    Container.set("PublisherRepository", publisherRepository);

    const userRepository = dataSource.getRepository(User).extend({});
    Container.set("UserRepository", userRepository);

    const stateRepository = dataSource.getRepository(State).extend({});
    Container.set("StateRepository", stateRepository);

    Container.set("logger", LoggerInstance);

    LoggerInstance.info("✌️ Repositories injected into container");
  } catch (e) {
    LoggerInstance.error("🔥 Error on dependency injector loader: %o", e);
    throw e;
  }
};
