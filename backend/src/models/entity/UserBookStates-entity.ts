import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from "typeorm";
import { State } from "./State-entity";
import { User } from "./User-entity";
import { Book } from "./Book-entity";

@Entity()
@Index(["userId", "stateId", "bookId"], { unique: true })
export class UserBookStates {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  stateId?: number;

  @Column()
  bookId?: number;

  @Column({ default: false })
  isFavorite: boolean;

  @ManyToOne(() => State, (state) => state.userBookStates, { nullable: true })
  state?: State;

  @ManyToOne(() => User, (user) => user.userBookStates)
  user: User;

  @ManyToOne(() => Book, (book) => book.userBookStates)
  book: Book;
}
