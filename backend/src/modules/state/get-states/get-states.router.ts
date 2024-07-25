import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { verifyAuthFromRequest } from "@/libs/middleware/auth";

import express, { Router } from "express";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { CreateStateSchema } from "../states.validation";
import { getStatesController } from "./get-states.controller";

export const getStatesRouteConfig: RouteConfig = {
  method: "get",
  path: "/states",
  tags: ["State"],
  responses: createApiResponse(z.array(CreateStateSchema), "Success"),
};

export const getStatesRouter: Router = express.Router();
getStatesRouter.get("/", verifyAuthFromRequest, getStatesController.getStates);
