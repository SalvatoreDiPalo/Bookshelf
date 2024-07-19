import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { UserSchema } from "./user.entity";
import express, { Router } from "express";
import {
  getProfileRouteConfig,
  getProfileRouter,
} from "./get-profile/get-profile.router";
import {
  createUserRouteConfig,
  createUserRouter,
} from "./create-user/create-user.router";

export const userRegistry = new OpenAPIRegistry();

userRegistry.register("User", UserSchema);
userRegistry.registerPath(getProfileRouteConfig);
userRegistry.registerPath(createUserRouteConfig);

export const userRouter: Router = express.Router();
userRouter.use("/", [getProfileRouter, createUserRouter]);
