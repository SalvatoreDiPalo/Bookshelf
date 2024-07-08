import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./models/entity/User"
import { Author } from "./models/entity/Author"
import { Publisher } from "./models/entity/Publisher"
import { Book } from "./models/entity/Book"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "admin",
    database: "postgres",
    synchronize: true,
    logging: false,
    entities: [User, Author, Publisher, Book],
    migrations: [],
    subscribers: [],
})
