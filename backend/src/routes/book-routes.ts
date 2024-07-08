import * as express from "express";
import { getBook } from "../controllers/book-controller";

export const bookRoutes = express.Router();

bookRoutes.get("/:isbn", getBook);
