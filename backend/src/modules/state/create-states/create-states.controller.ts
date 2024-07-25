import { Request, Response } from "express";
import { UserJwt } from "@/libs/models/userJwt";
import { handleServiceResponse } from "@/libs/utils/httpHandlers";
import { createStatesServiceInstance } from "./create-states.service";
import { CreateStatesSchema } from "./create-states.validation";

class CreateStatesController {
  public async createStates(request: Request, response: Response) {
    const currentUser: UserJwt = request.currentUser;

    const states = await createStatesServiceInstance.createStates(
      currentUser.id,
      CreateStatesSchema.parse(request.body)
    );

    return handleServiceResponse(states, response);
  }
}

export const createStatesController = new CreateStatesController();