import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Router } from "express";
import {
  getLibraryRouteConfig,
  getLibraryRouter,
} from "./get-library/get-library.router";
import { BookSchema } from "../book/book.validation";
import {
  addBookToLibraryRouteConfig,
  addBookToLibraryRouter,
} from "./add-book-to-library/add-book-to-library.router";
import {
  checkBooksInLibraryRouteConfig,
  checkBooksInLibraryRouter,
} from "./check-books-in-library/check-books-in-library.router";
import {
  getStatsLibraryRouteConfig,
  getStatsLibraryRouter,
} from "./get-stats-library/get-stats-library.router";

export const libraryRegistry = new OpenAPIRegistry();

libraryRegistry.register("Library", BookSchema);
libraryRegistry.registerPath(getLibraryRouteConfig);
libraryRegistry.registerPath(addBookToLibraryRouteConfig);
libraryRegistry.registerPath(checkBooksInLibraryRouteConfig);
libraryRegistry.registerPath(getStatsLibraryRouteConfig);

export const libraryRouter: Router = express.Router();
libraryRouter.use("/", [
  getLibraryRouter,
  addBookToLibraryRouter,
  checkBooksInLibraryRouter,
  getStatsLibraryRouter,
]);
