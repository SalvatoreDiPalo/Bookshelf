import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/libs/models/serviceResponse";
import { logger } from "@/server";
import { CreateStates } from "../states.validation";
import { State } from "@/modules/common/state/state.entity";
import { stateRepositoryInstance } from "@/modules/common/state/state.repository";
import { stateMapperInstance } from "../state.mapper";

class GetStatesService {
  // get states
  async getStates(
    userId: string
  ): Promise<ServiceResponse<CreateStates[] | null>> {
    try {
      const states: State[] = await stateRepositoryInstance.findAllByUser(
        userId
      );

      return ServiceResponse.success<CreateStates[]>(
        states.map((state) => stateMapperInstance.toReponse(state))
      );
    } catch (ex) {
      const errorMessage = `Error searching states: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while getting states.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const getStatesServiceInstance = new GetStatesService();
