import { z } from "zod";

import {
  createApiRequest,
  createApiResponse,
} from "@/api-docs/openAPIResponseBuilders";
import { verifyAuthFromRequest } from "@/libs/middleware/auth";

import express, { Router } from "express";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { validateRequest } from "@/libs/utils/httpHandlers";
import {
  CreateStateSchema,
  CreateStatesSchema,
} from "./create-states.validation";
import { createStatesController } from "./create-states.controller";

export const createStatesRouteConfig: RouteConfig = {
  method: "post",
  path: "/states",
  tags: ["State"],
  request: createApiRequest(z.array(CreateStateSchema), "", true),
  responses: createApiResponse(z.array(CreateStateSchema), "Success"),
};

export const createStatesRouter: Router = express.Router();
createStatesRouter.post(
  "/",
  validateRequest(CreateStatesSchema),
  verifyAuthFromRequest,
  createStatesController.createStates
);
