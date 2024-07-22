import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Router } from "express";
import { createBookRouteConfig, createBookRouter } from "./create-book/create-book.router";
import { BookSchema } from "./book.validation";

export const bookRegistry = new OpenAPIRegistry();

bookRegistry.register("Book", BookSchema);
bookRegistry.registerPath(createBookRouteConfig);
//stateRegistry.registerPath(createStatesRouteConfig);

export const bookRouter: Router = express.Router();
bookRouter.use("/", [createBookRouter]);
