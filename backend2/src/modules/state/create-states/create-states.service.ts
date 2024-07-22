import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/libs/models/serviceResponse";
import { logger } from "@/server";
import { State } from "@/modules/common/state/state.entity";
import { stateRepositoryInstance } from "@/modules/common/state/state.repository";
import { User } from "@/modules/common/user/user.entity";
import { userRepositoryInstance } from "@/modules/common/user/user.repository";
import { stateMapperInstance } from "../state.mapper";
import { userBookStateRepositoryInstance } from "@/modules/common/userBookState/userBookState.repository";
import { CreateStates } from "../states.validation";

class CreateStatesService {
  // Create states
  async createStates(
    userId: string,
    statesToAdd: CreateStates[]
  ): Promise<ServiceResponse<CreateStates[] | null>> {
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

      const currentStates: State[] =
        await stateRepositoryInstance.findAllByUser(user.id);
      const finalStates: CreateStates[] = [];
      let order: number = 1;
      for (let state of statesToAdd) {
        let savedState = currentStates.find(
          (a) => a.id === state.id && a.name === state.name
        );
        if (savedState) {
          // Remove element from array
          currentStates.splice(currentStates.indexOf(savedState), 1);

          if (!savedState.editable && savedState.name !== state.name) {
            return ServiceResponse.failure(
              "Can not modify state with id " + savedState.id,
              null,
              StatusCodes.BAD_GATEWAY
            );
          }
          if (savedState.order !== order) {
            savedState = await stateRepositoryInstance.updateOrder(
              savedState.id,
              order
            );
          }
        } else {
          savedState = await stateRepositoryInstance.insert(
            state.name,
            user.id,
            order,
            true
          );
        }

        order++;
        finalStates.push(stateMapperInstance.toReponse(savedState));
      }

      const listWithNotEditableItems = currentStates.filter(
        (state) => !state.editable
      );
      if (listWithNotEditableItems.length) {
        return ServiceResponse.failure(
          "Could not edit not editable items",
          null,
          StatusCodes.NOT_FOUND
        );
      }

      await this.deleteStates(currentStates);
      logger.debug("Returning %o", finalStates);
      return ServiceResponse.success<CreateStates[]>(
        finalStates,
      );
    } catch (ex) {
      const errorMessage = `Error inserting users: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while creating states.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Removes elements not included in the body
   * @param statesFromDb Items retrieved from the database
   */
  private async deleteStates(statesFromDb: State[]) {
    if (!statesFromDb.length) {
      return;
    }
    logger.debug("Needs to remove %o", statesFromDb);

    const stateIds = statesFromDb.map((state) => state.id);

    await userBookStateRepositoryInstance.updateStateIdToNullByStateIds(
      stateIds
    );

    await stateRepositoryInstance.deleteByIds(stateIds);
  }
}

export const createStatesServiceInstance = new CreateStatesService();
