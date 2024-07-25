import { Request, Response } from "express";
import { handleServiceResponse } from "@/libs/utils/httpHandlers";
import { UserJwt } from "@/libs/models/userJwt";
import { getStatsLibraryServiceInstance } from "./get-stats-library.service";

class GetStatsLibraryController {
  public async getStats(request: Request, response: Response) {
    const currentUser: UserJwt = request.currentUser;

    const library = await getStatsLibraryServiceInstance.getStats(
      currentUser.id
    );

    return handleServiceResponse(library, response);
  }
}

export const getStatsLibraryController = new GetStatsLibraryController();
