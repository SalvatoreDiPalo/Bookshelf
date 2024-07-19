import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { UserSchema } from "../../common/user/user.entity";
import { getProfileServiceInstance } from "./get-profile.service";
import { verifyAuthFromRequest } from "@/libs/middleware/auth";
import express, { Router } from "express";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";

export const getProfileRouteConfig: RouteConfig = {
  method: "post",
  path: "/users",
  tags: ["User"],
  description: "Allows to recover the user's profile",
  responses: createApiResponse(UserSchema, "Success"),
};

export const getProfileRouter: Router = express.Router();
getProfileRouter.get(
  "/profile",
  verifyAuthFromRequest,
  getProfileServiceInstance.getProfile
);
