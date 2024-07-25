import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { verifyAuthFromRequest } from "@/libs/middleware/auth";

import express, { Router } from "express";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { StatsSchema } from "./get-stats-library.validation";
import { getStatsLibraryController } from "./get-stats-library.controller";

export const getStatsLibraryRouteConfig: RouteConfig = {
  method: "get",
  path: "/library/stats",
  tags: ["Library"],
  responses: createApiResponse(StatsSchema, "Success"),
};

export const getStatsLibraryRouter: Router = express.Router();
getStatsLibraryRouter.get(
  "/stats",
  verifyAuthFromRequest,
  getStatsLibraryController.getStats
);
