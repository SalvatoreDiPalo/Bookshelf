import { Request, Response } from "express";
import { UserJwt } from "@/libs/models/userJwt";
import { handleServiceResponse } from "@/libs/utils/httpHandlers";
import { getBookServiceInstance } from "./get-book.service";

class GetBookController {
  public async getBook(request: Request, response: Response) {
    const book = await getBookServiceInstance.getBook(request.params.isbn);

    return handleServiceResponse(book, response);
  }
}

export const getBookController = new GetBookController();
