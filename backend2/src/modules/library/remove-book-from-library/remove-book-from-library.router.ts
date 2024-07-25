import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { verifyAuthFromRequest } from "@/libs/middleware/auth";

import express, { Router } from "express";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { validateRequest } from "@/libs/utils/httpHandlers";
import { BookWithRelationsSchema } from "@/modules/common/book/book.entity";
import { BookIdSchema, BookIdSchemaParamsSchema } from "../library.validation";
import { removeBookFromLibraryController } from "./remove-book-from-library.controller";

export const removeBookFromLibraryRouteConfig: RouteConfig = {
  method: "delete",
  path: "/library/book/{bookId}",
  tags: ["Library"],
  request: {
    params: BookIdSchema,
  },
  responses: createApiResponse(BookWithRelationsSchema, "Success"),
};

export const removeBookFromLibraryRouter: Router = express.Router();
removeBookFromLibraryRouter.delete(
  "/book/:bookId",
  validateRequest(BookIdSchemaParamsSchema),
  verifyAuthFromRequest,
  removeBookFromLibraryController.removeBookFromLibrary
);
