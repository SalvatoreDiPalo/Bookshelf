import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { UserSchema } from "../../common/user/user.entity";
import { verifyAuthFromRequest } from "@/libs/middleware/auth";

import express, { Router } from "express";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { getBookController } from "./get-book.controller";
import { validateRequest } from "@/libs/utils/httpHandlers";
import { IsbnParamSchema } from "../book.validation";

export const getBookRouteConfig: RouteConfig = {
  method: "post",
  path: "/books",
  tags: ["Book"],
  responses: createApiResponse(UserSchema, "Success"),
};

export const getBookRouter: Router = express.Router();
getBookRouter.get(
  "/isbn/:isbn",
  validateRequest(IsbnParamSchema),
  verifyAuthFromRequest,
  getBookController.getBook
);
