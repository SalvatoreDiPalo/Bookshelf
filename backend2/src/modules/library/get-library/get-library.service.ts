import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/libs/models/serviceResponse";
import { logger } from "@/server";
import { userRepositoryInstance } from "@/modules/common/user/user.repository";
import { SearchLibrary } from "./get-library.validation";
import { libraryRepositoryInstance } from "../../common/library/library.repository";
import { BookWithRelations } from "@/modules/book/book.validation";
import { ResultDTO } from "@/libs/models/resultDto";

class GetLibraryService {
  // Get Library
  async getLibrary(
    userJwtId: string,
    searchLibrary: SearchLibrary
  ): Promise<ServiceResponse<ResultDTO<BookWithRelations> | null>> {
    logger.debug("Params %o - searchLibrary: %o", userJwtId, searchLibrary);
    try {
      let user = await userRepositoryInstance.findOneByUserId(userJwtId);
      if (!user) {
        logger.error("User not found");
        return ServiceResponse.failure(
          "User not found",
          null,
          StatusCodes.UNAUTHORIZED
        );
      }

      const result = await libraryRepositoryInstance.findAll(
        user.id,
        searchLibrary
      );

      const count = await libraryRepositoryInstance.countAll(user.id, searchLibrary);

      const dto: ResultDTO<BookWithRelations> = {
        totalItems: count,
        items: result,
      };

      logger.debug("Founded %d total items", count, result);
      return ServiceResponse.success<ResultDTO<BookWithRelations>>(dto);
    } catch (ex) {
      const errorMessage = `Error get library: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while searching library.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const getLibraryServiceInstance = new GetLibraryService();
