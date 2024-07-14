import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinTable,
  ManyToOne,
} from "typeorm";
import { State } from "./State-entity";
import { User } from "./User-entity";
import { Book } from "./Book-entity";

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
