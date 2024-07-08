import * as express from "express";
import { getAuthors } from "../controllers/author-controller";

export const authorRoutes = express.Router();

authorRoutes.get("/", getAuthors);
