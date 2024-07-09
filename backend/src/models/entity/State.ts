import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
} from "typeorm";
import { User } from "./User";
import { UserBookStates } from "./UserBookStates";

@Entity()
@Index(["name", "user"], { unique: true })
export class State {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.states)
  user: User;

  @OneToMany(() => UserBookStates, (userBookStates) => userBookStates.state)
  userBookStates?: UserBookStates[];
}
