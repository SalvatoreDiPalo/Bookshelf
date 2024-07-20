import { State } from "../common/state/state.entity";
import { CreateStates, CreateStateSchema } from "./states.validation";

class StateMapper {
  toReponse(entity: State): CreateStates {
    const record: CreateStates = {
      id: entity.id,
      name: entity.name,
      isEditable: entity.editable,
    };
    return CreateStateSchema.parse(record);
  }
}

export const stateMapperInstance = new StateMapper();
