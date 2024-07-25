import { Request, Response } from "express";
import { handleServiceResponse } from "@/libs/utils/httpHandlers";
import { createBookServiceInstance } from "./create-book.service";
import { CreateBook } from "./create-book.validation";
import { UserJwt } from "@/libs/models/userJwt";

class CreateBookController {
  public async createBook(request: Request, response: Response) {
    const currentUser: UserJwt = request.currentUser;
    const book = await createBookServiceInstance.createBook(
      request.body as CreateBook,
      currentUser.id
    );

    return handleServiceResponse(book, response);
  }
}

export const createBookController = new CreateBookController();
