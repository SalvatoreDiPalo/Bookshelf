import { Book } from "../../modules/book/book.validation";

export interface BookFindColumns extends Book {
  publisherName: string;
}
