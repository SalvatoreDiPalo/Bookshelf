import { Request, Response } from "express";
import { UserJwt } from "@/libs/models/userJwt";
import { handleServiceResponse } from "@/libs/utils/httpHandlers";
import { addBookToLibraryServiceInstance } from "./add-book-to-library.service";
import { AddBookToLibrarySchema } from "./add-book-to-library.validation";

class AddBookToLibraryController {
  public async addBookToLibrary(request: Request, response: Response) {
    const currentUser: UserJwt = request.currentUser;

    const book = await addBookToLibraryServiceInstance.addBookToLibrary(
      currentUser.id,
      AddBookToLibrarySchema.parse(request.params).bookId
    );

    return handleServiceResponse(book, response);
  }
}

export const addBookToLibraryController = new AddBookToLibraryController();
