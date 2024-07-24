import { Request, Response } from "express";
import { UserJwt } from "@/libs/models/userJwt";
import { handleServiceResponse } from "@/libs/utils/httpHandlers";
import { updateStateLibraryServiceInstance } from "./update-state-library.service";
import { UpdateStateIdSchema } from "./update-state-library.validation";
import { BookIdSchema } from "../library.validation";

class UpdateStateLibraryController {
  public async updateState(request: Request, response: Response) {
    const currentUser: UserJwt = request.currentUser;

    const book = await updateStateLibraryServiceInstance.updateState(
      currentUser.id,
      BookIdSchema.parse(request.params).bookId,
      UpdateStateIdSchema.parse(request.body).stateId
    );

    return handleServiceResponse(book, response);
  }
}

export const updateStateToLibraryController =
  new UpdateStateLibraryController();
