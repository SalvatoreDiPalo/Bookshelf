import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Router } from "express";
import { StateSchema } from "../common/state/state.entity";
import {
  createStatesRouteConfig,
  createStatesRouter,
} from "./create-states/create-states.router";

export const stateRegistry = new OpenAPIRegistry();

stateRegistry.register("State", StateSchema);
//stateRegistry.registerPath(getProfileRouteConfig);
stateRegistry.registerPath(createStatesRouteConfig);

export const stateRouter: Router = express.Router();
stateRouter.use("/", [createStatesRouter]);
