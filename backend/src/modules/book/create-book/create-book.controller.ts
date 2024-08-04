import { Request, Response } from "express";
import { handleServiceResponse } from "@/libs/utils/httpHandlers";
import { createBookServiceInstance } from "./create-book.service";
import { CreateBook } from "./create-book.validation";

class CreateBookController {
  public async createBook(request: Request, response: Response) {
    const book = await createBookServiceInstance.createBook(
      request.body as CreateBook
    );

    return handleServiceResponse(book, response);
  }
}

export const createBookController = new CreateBookController();
