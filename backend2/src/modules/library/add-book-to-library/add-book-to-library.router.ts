import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { verifyAuthFromRequest } from "@/libs/middleware/auth";

import express, { Router } from "express";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { validateRequest } from "@/libs/utils/httpHandlers";
import {
  AddBookToLibraryParamSchema,
  AddBookToLibrarySchema,
} from "./add-book-to-library.validation";
import { addBookToLibraryController } from "./add-book-to-library.controller";
import { BookWithRelationsSchema } from "@/modules/common/book/book.entity";

export const addBookToLibraryRouteConfig: RouteConfig = {
  method: "post",
  path: "/library/book/{bookId}",
  tags: ["Library"],
  request: {
    params: AddBookToLibrarySchema,
  },
  responses: createApiResponse(BookWithRelationsSchema, "Success"),
};

export const addBookToLibraryRouter: Router = express.Router();
addBookToLibraryRouter.post(
  "/book/:bookId",
  validateRequest(AddBookToLibraryParamSchema),
  verifyAuthFromRequest,
  addBookToLibraryController.addBookToLibrary
);
