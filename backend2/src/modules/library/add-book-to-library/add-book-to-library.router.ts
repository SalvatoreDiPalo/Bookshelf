import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { verifyAuthFromRequest } from "@/libs/middleware/auth";

import express, { Router } from "express";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { validateRequest } from "@/libs/utils/httpHandlers";
import { BookWithRelationsSchema } from "@/modules/book/book.validation";
import {
  AddBookToLibraryParamSchema,
  AddBookToLibrarySchema,
} from "./add-book-to-library.validation";
import { addBookToLibraryController } from "./add-book-to-library.controller";

export const addBookToLibraryRouteConfig: RouteConfig = {
  method: "post",
  path: "/library/add/:bookId",
  tags: ["Library"],
  request: {
    params: AddBookToLibrarySchema,
  },
  responses: createApiResponse(BookWithRelationsSchema, "Success"),
};

export const addBookToLibraryRouter: Router = express.Router();
addBookToLibraryRouter.post(
  "/add/:bookId",
  validateRequest(AddBookToLibraryParamSchema),
  verifyAuthFromRequest,
  addBookToLibraryController.addBookToLibrary
);
