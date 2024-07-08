import * as express from "express";
import { getPublishers } from "../controllers/publisher-controller";

export const publisherRoutes = express.Router();

publisherRoutes.get("/", getPublishers);
