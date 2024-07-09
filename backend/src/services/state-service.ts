import { Inject, Service } from "typedi";
import { Repository } from "typeorm";
import { User } from "../models/entity/User";
import { State } from "../models/entity/State";
import { StateDTO } from "../models/dto/state-dto";
import { HttpException } from "../models/exceptions/http-exception";

@Service()
export default class StateService {
  constructor(
    @Inject("StateRepository")
    private readonly stateRepository: Repository<State>,
    @Inject("UserRepository")
    private readonly userRepository: Repository<User>,
    @Inject("logger") private readonly logger
  ) {}

  public async getStates(user: User): Promise<StateDTO[]> {
    const states: State[] = await this.stateRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
    });
    return states.map((state) => this.mapState(state));
  }

  public async saveState(user: User, name: string): Promise<StateDTO> {
    const state: State = await this.stateRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        name: name,
      },
    });
    if (state) {
      throw new HttpException(400, "Duplicate value");
    }
    const stateToCreate: State = {
      user: user,
      name: name,
    };
    const createdState: State = await this.stateRepository.save(stateToCreate);
    return this.mapState(createdState);
  }

  public async deleteState(user: User, id: number): Promise<void> {
    const state: State = await this.stateRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        id: id,
      },
    });
    if (!state) {
      throw new HttpException(404, "State could not be founded!");
    }
    await this.stateRepository.delete(state);
  }

  private mapState(state: State): StateDTO {
    return {
      id: state.id,
      name: state.name,
    };
  }
}
