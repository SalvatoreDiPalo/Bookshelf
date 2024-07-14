import { Inject, Service } from "typedi";
import { Repository } from "typeorm";
import { CurrentUser } from "../models/current-user";
import { UserDTO } from "../models/dto/user-dto";
import { config } from "../config";
import { State } from "../models/entity/State-entity";
import { User } from "../models/entity/User-entity";

@Service()
export default class UserService {
  constructor(
    @Inject("UserRepository")
    private readonly userRepository: Repository<User>,
    @Inject("StateRepository")
    private readonly stateRepository: Repository<State>,
    @Inject("logger") private readonly logger
  ) {}

  public async getUser(currentUser: CurrentUser): Promise<UserDTO> {
    let dbUser: User = await this.findUser(currentUser.sub);
    if (dbUser == null) {
      this.logger.debug(
        "User %s not present -> calling saveUser",
        currentUser.sub
      );
      await this.saveUser(currentUser);
    }
    dbUser = await this.findUser(currentUser.sub);
    return {
      id: dbUser.userId,
      username: dbUser.username,
      createdAt: dbUser.createdDate,
      updatedAt: dbUser.updatedDate,
    };
  }

  private async saveUser(currentUser: CurrentUser): Promise<void> {
    this.logger.debug("Creating user %s", currentUser.sub);
    const defaultStates = await this.createDefaultStates();
    const dbUser: User = {
      userId: currentUser.sub,
      username: currentUser.username || currentUser.sub,
      isVisibile: false,
      states: defaultStates,
    };
    await this.userRepository.save(dbUser);
  }

  public async findUser(userId: string): Promise<User | null> {
    return await this.userRepository.findOneBy({
      userId,
    });
  }

  private async createDefaultStates(): Promise<State[]> {
    const defaultStates: State[] = [
      {
        name: config.defaultStates.inProgress,
        editable: false,
        order: 1
      },
      {
        name: config.defaultStates.finished,
        editable: false,
        order: 2
      },
    ];
    this.logger.debug("Creating default states %o", defaultStates);
    return await this.stateRepository.save(defaultStates);
  }
}
