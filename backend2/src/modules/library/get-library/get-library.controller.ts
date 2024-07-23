import { Request, Response } from "express";
import { handleServiceResponse } from "@/libs/utils/httpHandlers";
import { UserJwt } from "@/libs/models/userJwt";
import { getLibraryServiceInstance } from "./get-library.service";
import { LibrarySchema } from "../library.validation";

class GetLibraryController {
  public async getLibrary(request: Request, response: Response) {
    const currentUser: UserJwt = request.currentUser;

    const library = await getLibraryServiceInstance.getLibrary(
      currentUser.id,
      LibrarySchema.parse(request.query)
    );

    return handleServiceResponse(library, response);
  }
}

export const getLibraryController = new GetLibraryController();
