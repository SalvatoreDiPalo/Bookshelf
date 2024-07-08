import { AppDataSource } from "./data-source";
import * as express from "express";
import { authorRoutes } from "./routes/author-routes";
import { publisherRoutes } from "./routes/publisher-routes";
import morgan = require("morgan");
import { bookRoutes } from "./routes/book-routes";

const port = process.env.SERVER_PORT || 3000;

// establish database connection
AppDataSource.initialize()
  .then(async () => console.log("Connected with the database..."))
  .catch((error) => console.log(error));

// create and setup express app
const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));

// register routes
app.use("/authors", authorRoutes);
app.use("/publishers", publisherRoutes);
app.use("/books", bookRoutes);

// start express server
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
