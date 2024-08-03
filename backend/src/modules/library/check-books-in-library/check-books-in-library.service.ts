import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/libs/models/serviceResponse";
import { logger } from "@/server";
import { libraryRepositoryInstance } from "../../common/library/library.repository";
import { CheckBooksInLibrary } from "./check-books-in-library.validation";

class CheckBooksInLibraryService {
  async checkBooks(
    userJwtId: string,
    googleBookIds: CheckBooksInLibrary
  ): Promise<ServiceResponse<string[] | null>> {
    logger.debug("Params %o - searchLibrary: %o", userJwtId, googleBookIds);
    try {
      const result =
        await libraryRepositoryInstance.getBooksInLibraryByGoogleIds(
          userJwtId,
          googleBookIds
        );

      return ServiceResponse.success<string[]>(result);
    } catch (ex) {
      const errorMessage = `Error checking books in library: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while checking books in library.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const checkBooksInLibraryServiceInstance =
  new CheckBooksInLibraryService();
