import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Router } from "express";
import { StateSchema } from "../common/state/state.entity";

export const stateRegistry = new OpenAPIRegistry();

stateRegistry.register("Book", StateSchema);
//stateRegistry.registerPath(getStatesRouteConfig);
//stateRegistry.registerPath(createStatesRouteConfig);

export const bookRouter: Router = express.Router();
//bookRouter.use("/", [createStatesRouter, getStatesRouter]);
