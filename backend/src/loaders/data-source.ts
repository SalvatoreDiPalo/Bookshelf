import "reflect-metadata";
import { DataSource } from "typeorm";
import { Author } from "../models/entity/Author";
import { Publisher } from "../models/entity/Publisher";
import { Book } from "../models/entity/Book";
import { config } from "../config";
import { User } from "../models/entity/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.databaseName,
  synchronize: true,
  logging: false,
  entities: ["src/models/entity/*.ts"],
  migrations: [],
  subscribers: [],
});

export const dataSource = async (): Promise<DataSource> => {
  return await AppDataSource.initialize();
};
