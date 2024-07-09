import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinTable,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { State } from "./State";
import { Book } from "./Book";

@Entity()
export class UserBookStates {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  userId: number;

  @Column()
  stateId: number;

  @Column()
  bookId: number;

  @ManyToOne(() => State, (state) => state.userBookStates)
  state: State;

  @ManyToOne(() => User, (user) => user.userBookStates)
  user: User;

  @ManyToOne(() => Book, (book) => book.userBookStates)
  book: Book;
}
