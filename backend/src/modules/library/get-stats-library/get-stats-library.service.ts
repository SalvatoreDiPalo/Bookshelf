import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/libs/models/serviceResponse";
import { logger } from "@/server";
import { libraryRepositoryInstance } from "../../common/library/library.repository";
import { Stats } from "./get-stats-library.validation";
import { env } from "@/libs/utils/envConfig";

class GetStatsLibraryService {
  async getStats(userJwtId: string): Promise<ServiceResponse<Stats | null>> {
    logger.debug("User %o", userJwtId);
    try {
      const result = await libraryRepositoryInstance.getStats(
        userJwtId,
        env.DEFAULT_FINISHED
      );

      return ServiceResponse.success<Stats>(result);
    } catch (ex) {
      const errorMessage = `Error searching stats from library: ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while searching stats from library.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const getStatsLibraryServiceInstance = new GetStatsLibraryService();
