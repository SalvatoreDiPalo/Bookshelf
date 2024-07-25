import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Router } from "express";
import { StateSchema } from "../common/state/state.entity";
import {
  createStatesRouteConfig,
  createStatesRouter,
} from "./create-states/create-states.router";
import { getStatesRouteConfig, getStatesRouter } from "./get-states/get-states.router";

export const stateRegistry = new OpenAPIRegistry();

stateRegistry.register("State", StateSchema);
stateRegistry.registerPath(getStatesRouteConfig);
stateRegistry.registerPath(createStatesRouteConfig);

export const stateRouter: Router = express.Router();
stateRouter.use("/", [createStatesRouter, getStatesRouter]);
