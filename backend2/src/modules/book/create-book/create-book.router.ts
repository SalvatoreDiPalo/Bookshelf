import {
  createApiRequestBody,
  createApiResponse,
} from "@/api-docs/openAPIResponseBuilders";
import { verifyAuthFromRequest } from "@/libs/middleware/auth";

import express, { Router } from "express";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { createBookController } from "./create-book.controller";
import { validateRequest } from "@/libs/utils/httpHandlers";
import { CreateBookBodySchema, CreateBookSchema } from "./create-book.validation";
import { BookWithRelationsSchema } from "../book.validation";

export const createBookRouteConfig: RouteConfig = {
  method: "post",
  path: "/books",
  tags: ["Book"],
  request: createApiRequestBody(CreateBookSchema, "", true),
  responses: createApiResponse(BookWithRelationsSchema, "Success"),
};

export const createBookRouter: Router = express.Router();
createBookRouter.post(
  "/",
  validateRequest(CreateBookBodySchema),
  verifyAuthFromRequest,
  createBookController.createBook
);
