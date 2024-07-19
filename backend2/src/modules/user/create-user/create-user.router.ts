import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { UserSchema } from "../../common/user/user.entity";
import { createUserController } from "./create-user.controller";
import { verifyAuthFromRequest } from "@/libs/middleware/auth";

import express, { Router } from "express";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";

export const createUserRouteConfig: RouteConfig = {
  method: "get",
  path: "/users/profile",
  tags: ["User"],
  description: "Allows to save the newly authenticated user. It does not require parameters as it retrieves them from the JWT",
  responses: createApiResponse(z.array(UserSchema), "Success"),
};

export const createUserRouter: Router = express.Router();
createUserRouter.post(
  "/",
  verifyAuthFromRequest,
  createUserController.createUser
);
