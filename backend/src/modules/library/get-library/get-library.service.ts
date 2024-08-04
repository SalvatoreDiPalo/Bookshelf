import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/libs/models/serviceResponse";
import { logger } from "@/server";
import { SearchLibrary } from "./get-library.validation";
import { libraryRepositoryInstance } from "../../common/library/library.repository";
import { ResultDTO } from "@/libs/models/resultDto";
import { BookWithRelations } from "@/modules/common/book/book.entity";

class GetLibraryService {
  // Get Library
  async getLibrary(
    userJwtId: string,
    searchLibrary: SearchLibrary
  ): Promise<ServiceResponse<ResultDTO<BookWithRelations> | null>> {
    logger.debug("Params %o - searchLibrary: %o", userJwtId, searchLibrary);
    try {
      const result = await libraryRepositoryInstance.findAll(
        userJwtId,
        searchLibrary
      );

      const count = await libraryRepositoryInstance.countAll(userJwtId, searchLibrary);

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
