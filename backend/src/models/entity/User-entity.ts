import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { UserBookState } from "./UserBookState-entity";
import { State } from "./State-entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  userId: string;

  @Column({ unique: true })
  username: string;

  @Column({ default: true })
  isVisibile: boolean;

  @CreateDateColumn()
  createdDate?: Date;

  @UpdateDateColumn()
  updatedDate?: Date;

  @OneToMany(() => State, (state) => state.user)
  states?: State[];

  @OneToMany(() => UserBookState, (userBookStates) => userBookStates.user)
  userBookStates?: UserBookState[];
}
