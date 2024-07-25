import { Request, Response } from "express";
import { UserJwt } from "@/libs/models/userJwt";
import { handleServiceResponse } from "@/libs/utils/httpHandlers";
import { createUserServiceInstance } from "./create-user.service";

class CreateUserController {
  public async createUser(request: Request, response: Response) {
    const currentUser: UserJwt = request.currentUser;

    const user = await createUserServiceInstance.createUser(
      currentUser.id,
      currentUser.sub
    );

    return handleServiceResponse(user, response);
  }
}

export const createUserController = new CreateUserController();
