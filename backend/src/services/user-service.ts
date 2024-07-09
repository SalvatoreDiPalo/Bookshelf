import { Inject, Service } from "typedi";
import { Repository } from "typeorm";
import { User } from "../models/entity/User";
import { CurrentUser } from "../models/current-user";
import { UserDTO } from "../models/dto/user-dto";

@Service()
export default class UserService {
  constructor(
    @Inject("UserRepository")
    private readonly userRepository: Repository<User>,
    @Inject("logger") private readonly logger
  ) {}

  public async getUser(currentUser: CurrentUser): Promise<UserDTO> {
    let dbUser: User = await this.findUser(currentUser.sub);
    if (dbUser == null) {
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
    const dbUser: User = {
      userId: currentUser.sub,
      username: currentUser.username || currentUser.sub,
      isVisibile: false,
    };
    await this.userRepository.save(dbUser);
  }

  public async findUser(userId: string): Promise<User | null> {
    return await this.userRepository.findOneBy({
      userId,
    });
  }
}
