import { Request, Response } from "express";
import { UserJwt } from "@/libs/models/userJwt";
import { handleServiceResponse } from "@/libs/utils/httpHandlers";
import { getProfileServiceInstance } from "./get-profile.service";

class GetProfileController {
  public async getProfile(request: Request, response: Response) {
    const currentUser: UserJwt = request.currentUser;

    const user = await getProfileServiceInstance.getProfile(currentUser.id);
    return handleServiceResponse(user, response);
  }
}

export const getProfileController = new GetProfileController();
