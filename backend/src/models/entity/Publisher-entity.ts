import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Book } from "./Book-entity";

@Entity()
export class Publisher {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Book, (book) => book.publisher)
  books: Book[];
}
