import { Router } from "express";
import book from "./routes/book";
import user from "./routes/user";
import author from "./routes/author";
import publisher from "./routes/publisher";
import state from "./routes/state";

export default () => {
  const app = Router();

  book(app);
  user(app);
  author(app);
  publisher(app);
  state(app);
  return app;
};
