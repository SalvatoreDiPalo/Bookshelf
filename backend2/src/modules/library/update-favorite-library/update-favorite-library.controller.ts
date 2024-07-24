import { Request, Response } from "express";
import { UserJwt } from "@/libs/models/userJwt";
import { handleServiceResponse } from "@/libs/utils/httpHandlers";
import { updateFavoriteLibraryServiceInstance } from "./update-favorite-library.service";
import {
  UpdateFavoriteBookIdSchema,
  UpdateFavoriteSchema,
} from "./update-favorite-library.validation";

class UpdateFavoriteLibraryController {
  public async updateFavorite(request: Request, response: Response) {
    const currentUser: UserJwt = request.currentUser;

    const book = await updateFavoriteLibraryServiceInstance.updateFavorite(
      currentUser.id,
      UpdateFavoriteBookIdSchema.parse(request.params).bookId,
      UpdateFavoriteSchema.parse(request.body).isFavorite
    );

    return handleServiceResponse(book, response);
  }
}

export const updateFavoriteToLibraryController =
  new UpdateFavoriteLibraryController();
