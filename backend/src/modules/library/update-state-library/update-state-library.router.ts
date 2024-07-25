import {
  createApiRequestBody,
  createApiResponse,
} from "@/api-docs/openAPIResponseBuilders";
import { verifyAuthFromRequest } from "@/libs/middleware/auth";

import express, { Router } from "express";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { validateRequest } from "@/libs/utils/httpHandlers";
import { updateStateToLibraryController } from "./update-state-library.controller";
import { BookWithRelationsSchema } from "@/modules/common/book/book.entity";
import {
  UpdateStateIdBodySchema,
  UpdateStateIdSchema,
} from "./update-state-library.validation";
import { BookIdSchema, BookIdSchemaParamsSchema } from "../library.validation";

export const updateStateLibraryRouteConfig: RouteConfig = {
  method: "patch",
  path: "/library/book/{bookId}/state",
  tags: ["Library"],
  request: {
    body: createApiRequestBody(UpdateStateIdSchema, "State body"),
    params: BookIdSchema,
  },
  responses: createApiResponse(BookWithRelationsSchema, "Success"),
};

export const updateStateLibraryRouter: Router = express.Router();
updateStateLibraryRouter.patch(
  "/book/:bookId/state",
  validateRequest(UpdateStateIdBodySchema.merge(BookIdSchemaParamsSchema)),
  verifyAuthFromRequest,
  updateStateToLibraryController.updateState
);
