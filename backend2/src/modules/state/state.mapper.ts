import { State } from "../common/state/state.entity";
import {
  CreateStates,
  createStateSchema,
} from "./create-states/create-states.validation";

class StateMapper {
  toReponse(entity: State): CreateStates {
    const record: CreateStates = {
      id: entity.id,
      name: entity.name,
      isEditable: entity.editable,
    };
    return createStateSchema.parse(record);
  }
}

export const stateMapperInstance = new StateMapper();