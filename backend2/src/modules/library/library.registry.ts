import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Router } from "express";
import {
  getLibraryRouteConfig,
  getLibraryRouter,
} from "./get-library/get-library.router";
import { BookSchema } from "../book/book.validation";

export const libraryRegistry = new OpenAPIRegistry();

libraryRegistry.register("Library", BookSchema);
libraryRegistry.registerPath(getLibraryRouteConfig);
//stateRegistry.registerPath(createStatesRouteConfig);

export const libraryRouter: Router = express.Router();
libraryRouter.use("/", [getLibraryRouter]);
