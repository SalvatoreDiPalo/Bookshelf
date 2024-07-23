import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/libs/models/serviceResponse";
import { logger } from "@/server";
import { User } from "@/modules/common/user/user.entity";
import { userRepositoryInstance } from "@/modules/common/user/user.repository";
import { BookWithRelations } from "@/modules/book/book.validation";
import { bookRepositoryInstance } from "@/modules/book/book.repository";
import { libraryRepositoryInstance } from "@/modules/common/library/library.repository";

class AddBookToLibraryService {
  // Add book to library
  async addBookToLibrary(
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
      if (alreadyExistsInLibrary) {
        logger.error("Book already exists in library", bookId);
        return ServiceResponse.failure(
          "Book already present in library",
          null,
          StatusCodes.BAD_REQUEST
        );
      }

      logger.debug("Adding book %o to library of user", book.id, user.id);
      await libraryRepositoryInstance.insert({
        userId: user.id,
        stateId: null,
        bookId: book.id!,
        isFavorite: false,
      });

      return ServiceResponse.success<BookWithRelations>(book);
    } catch (ex) {
      const errorMessage = `Error adding book to library: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while adding book to library.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const addBookToLibraryServiceInstance = new AddBookToLibraryService();
