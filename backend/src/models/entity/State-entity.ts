import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
} from "typeorm";
import { UserBookStates } from "./UserBookStates-entity";
import { User } from "./User-entity";

@Entity()
@Index(["name", "user"], { unique: true })
export class State {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ update: false, default: true })
  editable: boolean;

  @Column()
  order?: number;

  @ManyToOne(() => User, (user) => user.states, { nullable: false })
  user?: User;

  @OneToMany(() => UserBookStates, (userBookStates) => userBookStates.state)
  userBookStates?: UserBookStates[];
}
