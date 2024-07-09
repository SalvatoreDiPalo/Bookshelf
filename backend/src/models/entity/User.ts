import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { State } from "./State";
import { UserBookStates } from "./UserBookStates";

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

  @OneToMany(() => UserBookStates, (userBookStates) => userBookStates.user)
  userBookStates?: UserBookStates[];
}
