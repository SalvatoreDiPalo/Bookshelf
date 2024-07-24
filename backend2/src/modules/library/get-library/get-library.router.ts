import {
  createApiResponse,
  createPaginatedResponseSchema,
} from "@/api-docs/openAPIResponseBuilders";
import { verifyAuthFromRequest } from "@/libs/middleware/auth";

import express, { Router } from "express";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { validateRequest } from "@/libs/utils/httpHandlers";
import { getLibraryController } from "./get-library.controller";
import { LibraryQuerySchema } from "./get-library.validation";
import { LibrarySchema } from "../library.validation";
import { BookWithRelationsSchema } from "@/modules/common/book/book.entity";

export const getLibraryRouteConfig: RouteConfig = {
  method: "get",
  path: "/library",
  tags: ["Library"],
  request: {
    query: LibrarySchema,
  },
  responses: createApiResponse(
    createPaginatedResponseSchema(BookWithRelationsSchema),
    "Success"
  ),
};

export const getLibraryRouter: Router = express.Router();
getLibraryRouter.get(
  "/",
  validateRequest(LibraryQuerySchema),
  verifyAuthFromRequest,
  getLibraryController.getLibrary
);
