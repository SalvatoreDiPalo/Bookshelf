import { Request, Response } from "express";
import { handleServiceResponse } from "@/libs/utils/httpHandlers";
import { UserJwt } from "@/libs/models/userJwt";
import { checkBooksInLibraryServiceInstance } from "./check-books-in-library.service";
import { GoogleBookIdsSchema } from "./check-books-in-library.validation";

class CheckBooksInLibraryController {
  public async checkBooks(request: Request, response: Response) {
    const currentUser: UserJwt = request.currentUser;

    const library = await checkBooksInLibraryServiceInstance.checkBooks(
      currentUser.id,
      GoogleBookIdsSchema.parse(request.body)
    );

    return handleServiceResponse(library, response);
  }
}

export const checkBooksInLibraryController =
  new CheckBooksInLibraryController();
