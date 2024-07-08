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
} from "typeorm";
import { Author } from "./Author";
import { Publisher } from "./Publisher";

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
  subTitle: string;

  @Column()
  description: string;

  @Column()
  publishedDate: string;

  @Column({ nullable: true })
  bookCoverId?: number;

  @Column()
  pageCount: number;

  @CreateDateColumn()
  createdDate?: Date;

  @UpdateDateColumn()
  updatedDate?: Date;

  @OneToOne(() => Publisher)
  @JoinColumn()
  publisher: Publisher;

  @ManyToMany(() => Author)
  @JoinTable()
  authors: Author[];
}
