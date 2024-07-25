import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { UserSchema } from "../../common/user/user.entity";
import { verifyAuthFromRequest } from "@/libs/middleware/auth";
import express, { Router } from "express";
import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { getProfileController } from "./get-profile.controller";

export const getProfileRouteConfig: RouteConfig = {
  method: "get",
  path: "/users/profile",
  tags: ["User"],
  description: "Allows to recover the user's profile",
  responses: createApiResponse(UserSchema, "Success"),
};

export const getProfileRouter: Router = express.Router();
getProfileRouter.get(
  "/profile",
  verifyAuthFromRequest,
  getProfileController.getProfile
);
