import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/libs/models/serviceResponse";
import { logger } from "@/server";
import { User } from "@/modules/common/user/user.entity";
import { userRepositoryInstance } from "@/modules/common/user/user.repository";
import { libraryRepositoryInstance } from "@/modules/common/library/library.repository";
import { BookWithRelations } from "@/modules/common/book/book.entity";
import { bookRepositoryInstance } from "@/modules/common/book/book.repository";

class RemoveBookFromLibraryService {
  // Remove book from library
  async removeBookFromLibrary(
    userId: string,
    bookId: number
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

      const alreadyExistsInLibrary =
        await libraryRepositoryInstance.existsByBookIdAndUserId(
          book.id!,
          user.id
        );
      if (!alreadyExistsInLibrary) {
        logger.error("Book does not exists in library", bookId);
        return ServiceResponse.failure(
          "Book is not present in library",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      logger.debug(
        "Removing book %o from library of user %o",
        book.id,
        user.id
      );
      const isRemoved = await libraryRepositoryInstance.delete(
        user.id,
        book.id!
      );
      if (!isRemoved) {
        logger.error("Row not removed");
        return ServiceResponse.failure(
          "Book could not be removed from library",
          null,
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      return ServiceResponse.success<BookWithRelations>(book);
    } catch (ex) {
      const errorMessage = `Error removing book from library: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while removing book from library.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const removeBookFromLibraryServiceInstance =
  new RemoveBookFromLibraryService();