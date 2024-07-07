import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Author } from "./Author";
import { Publisher } from "./Publisher";

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isbn: string;

  @Column()
  title: string;

  @Column()
  subTitle: string;

  @Column()
  description: string;

  @Column()
  publishedDate: string;

  @Column()
  pageCount: number;

  @OneToOne(() => Publisher)
  @JoinColumn()
  publisher: Publisher;

  @ManyToMany(() => Author)
  @JoinTable()
  authors: Author[];
}
