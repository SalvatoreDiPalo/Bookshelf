import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Author } from "./Author";
import { Publisher } from "./Publisher";
import { User } from "./User";
import { UserBookStates } from "./UserBookStates";

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  bookId: string;

  @Column({ unique: true })
  isbn: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  subTitle?: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  publishedDate: string;

  @Column({ nullable: true })
  bookCoverId?: number;

  @Column({ nullable: true })
  pageCount?: number;

  @CreateDateColumn()
  createdDate?: Date;

  @UpdateDateColumn()
  updatedDate?: Date;

  @ManyToOne(() => Publisher, { nullable: true, cascade: false })
  @JoinColumn()
  publisher?: Publisher;

  @ManyToMany(() => Author, { cascade: false })
  @JoinTable()
  authors: Author[];

  @ManyToMany(() => User, { nullable: true })
  @JoinTable()
  users?: User[];

  @OneToMany(() => UserBookStates, (userBookStates) => userBookStates.book)
  userBookStates?: UserBookStates[];
}
