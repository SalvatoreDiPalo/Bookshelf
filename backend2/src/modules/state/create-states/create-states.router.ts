import {
  createApiRequestBody,
  createApiResponse,
} from "@/api-docs/openAPIResponseBuilders";
import { verifyAuthFromRequest } from "@/libs/middleware/auth";

import express, { Router } from "express";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { validateRequest } from "@/libs/utils/httpHandlers";
import {
  CreateStatesBodySchema,
  CreateStatesSchema,
} from "./create-states.validation";
import { createStatesController } from "./create-states.controller";

export const createStatesRouteConfig: RouteConfig = {
  method: "post",
  path: "/states",
  tags: ["State"],
  request: createApiRequestBody(CreateStatesSchema, "", true),
  responses: createApiResponse(CreateStatesSchema, "Success"),
};

export const createStatesRouter: Router = express.Router();
createStatesRouter.post(
  "/",
  validateRequest(CreateStatesBodySchema),
  verifyAuthFromRequest,
  createStatesController.createStates
);
