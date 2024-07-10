import { Router } from "express";
import book from "./routes/book-api";
import user from "./routes/user-api";
import author from "./routes/author-api";
import publisher from "./routes/publisher-api";
import state from "./routes/state-api";

export default () => {
  const app = Router();

  book(app);
  user(app);
  author(app);
  publisher(app);
  state(app);
  return app;
};
