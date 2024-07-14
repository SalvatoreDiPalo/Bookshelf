import { Inject, Service } from "typedi";
import { In, Repository } from "typeorm";
import { StateDTO } from "../models/dto/state-dto";
import { HttpException } from "../models/exceptions/http-exception";
import { State } from "../models/entity/State-entity";
import { User } from "../models/entity/User-entity";

@Service()
export default class StateService {
  constructor(
    @Inject("StateRepository")
    private readonly stateRepository: Repository<State>,
    @Inject("logger") private readonly logger
  ) {}

  public async getStates(user: User): Promise<StateDTO[]> {
    const states: State[] = await this.stateRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
      order: {
        order: "ASC",
      },
    });
    return states.map((state) => this.mapState(state));
  }

  public async saveState(
    user: User,
    statesToAdd: StateDTO[]
  ): Promise<StateDTO[]> {
    const statesFromDb: State[] = await this.stateRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
    });

    const finalStates: StateDTO[] = [];
    let order = 1;
    for (let state of statesToAdd) {
      let savedState = statesFromDb.find(
        (a) => a.id === state.id && a.name === state.name
      );
      if (savedState) {
        // Remove element from array
        statesFromDb.splice(statesFromDb.indexOf(savedState), 1);

        if (!savedState.editable && savedState.name !== state.name) {
          throw new HttpException(
            400,
            "Can not modify state with id " + savedState.id
          );
        }
      }
      
      savedState = await this.stateRepository.save({
        id: savedState ? savedState.id : undefined,
        name: state.name,
        editable: savedState && !savedState.editable ? false : true,
        order,
        user,
      } as State);
      order++;
      finalStates.push(this.mapState(savedState));
    }
    this.checkNotEditableItems(statesFromDb);

    await this.deleteStates(statesFromDb);
    this.logger.debug("Returning %o", finalStates);

    return finalStates;
  }

  /**
   * Check to see if any non-editable items have been deleted
   * @param statesFromDb Items retrieved from the database
   */
  private checkNotEditableItems(statesFromDb: State[]) {
    const listWithNotEditableItems = statesFromDb.filter(
      (state) => !state.editable
    );
    if (listWithNotEditableItems.length) {
      throw new HttpException(400, "Could not edit not editable items");
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
    this.logger.debug("Needs to remove %o", statesFromDb);
    await this.stateRepository.delete(statesFromDb.map((state) => state.id));
  }

  private mapState(state: State): StateDTO {
    return {
      id: state.id,
      name: state.name,
      isEditable: state.editable,
    };
  }
}
