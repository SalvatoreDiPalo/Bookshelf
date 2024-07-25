import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/libs/models/serviceResponse";
import { logger } from "@/server";
import { User } from "@/modules/common/user/user.entity";
import { userRepositoryInstance } from "@/modules/common/user/user.repository";
import { libraryRepositoryInstance } from "@/modules/common/library/library.repository";
import { BookWithRelations } from "@/modules/common/book/book.entity";
import { bookRepositoryInstance } from "@/modules/common/book/book.repository";

class UpdateFavoriteLibraryService {
  async updateFavorite(
    userId: string,
    bookId: number,
    isFavorite: boolean
  ): Promise<ServiceResponse<BookWithRelations | null>> {
    try {
      const user: User | undefined =
        await userRepositoryInstance.findOneByUserId(userId);

      if (!user) {
        return ServiceResponse.failure(
          "User not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }

      const book: BookWithRelations | undefined =
        await bookRepositoryInstance.findOneWithRelationsById(bookId);

      if (!book) {
        logger.error("Book with id %o not found", bookId);
        return ServiceResponse.failure(
          "Book not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }

      await libraryRepositoryInstance.updateFavorite(
        bookId,
        user.id,
        isFavorite
      );
      book.isFavorite = isFavorite;

      return ServiceResponse.success<BookWithRelations>(book);
    } catch (ex) {
      const errorMessage = `Error updating favorite in library: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while updating book favorite in library.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const updateFavoriteLibraryServiceInstance =
  new UpdateFavoriteLibraryService();
