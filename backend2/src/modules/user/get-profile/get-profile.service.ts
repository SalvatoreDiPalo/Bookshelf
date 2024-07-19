import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/libs/models/serviceResponse";
import { logger } from "@/server";
import { User } from "../../common/user/user.entity";
import { userRepositoryInstance } from "../../common/user/user.repository";

class GetProfileService {
  // Retrieves a single user by their ID
  async getProfile(userId: string): Promise<ServiceResponse<User | null>> {
    try {
      logger.debug("Trying to recover the user's profile");
      const user: User | undefined =
        await userRepositoryInstance.findOneByUserId(userId);
      if (!user) {
        return ServiceResponse.failure(
          "User not found",
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return ServiceResponse.success<User>("User found", user);
    } catch (ex) {
      const errorMessage = `Error finding user with user id ${userId}:, ${
        (ex as Error).message
      }`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while finding user.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const getProfileServiceInstance = new GetProfileService();
