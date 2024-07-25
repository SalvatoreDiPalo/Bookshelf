import {
  createApiRequestBody,
  createApiResponse,
  createPaginatedResponseSchema,
} from "@/api-docs/openAPIResponseBuilders";
import { verifyAuthFromRequest } from "@/libs/middleware/auth";

import express, { Router } from "express";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { validateRequest } from "@/libs/utils/httpHandlers";
import {
  CheckBookInLibraryBodySchema,
  GoogleBookIdsSchema,
} from "./check-books-in-library.validation";
import { checkBooksInLibraryController } from "./check-books-in-library.controller";

export const checkBooksInLibraryRouteConfig: RouteConfig = {
  method: "post",
  path: "/library/check",
  tags: ["Library"],
  description:
    "Allows to receive the ID of books already present in the current user's library. Check by comparison if the google book id is present in the library",
  request: {
    body: createApiRequestBody(GoogleBookIdsSchema, "Google book ids"),
  },
  responses: createApiResponse(GoogleBookIdsSchema, "Success"),
};

export const checkBooksInLibraryRouter: Router = express.Router();
checkBooksInLibraryRouter.post(
  "/check",
  validateRequest(CheckBookInLibraryBodySchema),
  verifyAuthFromRequest,
  checkBooksInLibraryController.checkBooks
);
