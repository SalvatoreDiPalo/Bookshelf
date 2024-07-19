import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/libs/models/serviceResponse";
import { logger } from "@/server";
import { User } from "../user.entity";
import { userRepositoryInstance } from "../user.repository";

class CreateUserService {
  // Create user
  async createUser(
    userId: string,
    username: string
  ): Promise<ServiceResponse<User | null>> {
    try {
      const existsUser = await userRepositoryInstance.existsByUserId(userId);
      if (existsUser) {
        return ServiceResponse.failure(
          "User already present",
          null,
          StatusCodes.CONFLICT
        );
      }
      const createdUser: User = await userRepositoryInstance.insert(
        userId,
        username,
        true
      );
      return ServiceResponse.success<User>("Users found", createdUser);
    } catch (ex) {
      const errorMessage = `Error inserting users: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating user.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const createUserServiceInstance = new CreateUserService();
