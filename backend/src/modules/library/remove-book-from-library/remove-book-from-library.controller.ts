import { Request, Response } from "express";
import { UserJwt } from "@/libs/models/userJwt";
import { handleServiceResponse } from "@/libs/utils/httpHandlers";
import { BookIdSchema } from "../library.validation";
import { removeBookFromLibraryServiceInstance } from "./remove-book-from-library.service";

class RemoveBookFromLibraryController {
  public async removeBookFromLibrary(request: Request, response: Response) {
    const currentUser: UserJwt = request.currentUser;

    const book =
      await removeBookFromLibraryServiceInstance.removeBookFromLibrary(
        currentUser.id,
        BookIdSchema.parse(request.params).bookId
      );

    return handleServiceResponse(book, response);
  }
}

export const removeBookFromLibraryController =
  new RemoveBookFromLibraryController();
