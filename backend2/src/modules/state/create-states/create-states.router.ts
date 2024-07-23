import { z } from "zod";

import {
  createApiRequestBody,
  createApiResponse,
} from "@/api-docs/openAPIResponseBuilders";
import { verifyAuthFromRequest } from "@/libs/middleware/auth";

import express, { Router } from "express";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { validateRequest } from "@/libs/utils/httpHandlers";
import { CreateStatesSchema } from "./create-states.validation";
import { createStatesController } from "./create-states.controller";
import { CreateStateSchema } from "../states.validation";

export const createStatesRouteConfig: RouteConfig = {
  method: "post",
  path: "/states",
  tags: ["State"],
  request: createApiRequestBody(z.array(CreateStateSchema), "", true),
  responses: createApiResponse(z.array(CreateStateSchema), "Success"),
};

export const createStatesRouter: Router = express.Router();
createStatesRouter.post(
  "/",
  validateRequest(CreateStatesSchema),
  verifyAuthFromRequest,
  createStatesController.createStates
);
