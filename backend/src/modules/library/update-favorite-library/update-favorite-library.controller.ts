import { Request, Response } from "express";
import { UserJwt } from "@/libs/models/userJwt";
import { handleServiceResponse } from "@/libs/utils/httpHandlers";
import { updateFavoriteLibraryServiceInstance } from "./update-favorite-library.service";
import { UpdateFavoriteSchema } from "./update-favorite-library.validation";
import { commonValidations } from "@/libs/utils/commonValidation";
import { BookIdSchema } from "../library.validation";

class UpdateFavoriteLibraryController {
  public async updateFavorite(request: Request, response: Response) {
    const currentUser: UserJwt = request.currentUser;

    const book = await updateFavoriteLibraryServiceInstance.updateFavorite(
      currentUser.id,
      BookIdSchema.parse(request.params).bookId,
      UpdateFavoriteSchema.parse(request.body).isFavorite
    );

    return handleServiceResponse(book, response);
  }
}

export const updateFavoriteToLibraryController =
  new UpdateFavoriteLibraryController();
