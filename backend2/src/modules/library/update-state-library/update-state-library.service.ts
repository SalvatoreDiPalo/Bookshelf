import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/libs/models/serviceResponse";
import { logger } from "@/server";
import { User } from "@/modules/common/user/user.entity";
import { userRepositoryInstance } from "@/modules/common/user/user.repository";
import { libraryRepositoryInstance } from "@/modules/common/library/library.repository";
import { BookWithRelations } from "@/modules/common/book/book.entity";
import { bookRepositoryInstance } from "@/modules/common/book/book.repository";

class UpdateStateLibraryService {
  async updateState(
    userId: string,
    bookId: number,
    stateId: number | null
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

      await libraryRepositoryInstance.updateStateId(bookId, user.id, stateId);
      book.stateId = stateId ?? undefined;

      return ServiceResponse.success<BookWithRelations>(book);
    } catch (ex) {
      const errorMessage = `Error updating state in library: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while updating book state in library.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const updateStateLibraryServiceInstance =
  new UpdateStateLibraryService();
