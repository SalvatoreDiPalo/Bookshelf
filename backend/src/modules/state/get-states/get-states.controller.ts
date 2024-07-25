import { Request, Response } from "express";
import { UserJwt } from "@/libs/models/userJwt";
import { handleServiceResponse } from "@/libs/utils/httpHandlers";
import { getStatesServiceInstance } from "./get-states.service";

class GetStatesController {
  public async getStates(request: Request, response: Response) {
    const currentUser: UserJwt = request.currentUser;

    const states = await getStatesServiceInstance.getStates(currentUser.id);

    return handleServiceResponse(states, response);
  }
}

export const getStatesController = new GetStatesController();
