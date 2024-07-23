import { AuthorDTO } from "./AuthorDTO";
import { PublisherDTO } from "./PublisherDTO";

export interface BookDTO {
  id?: number;
  isbn: string;
  title: string;
  subTitle?: string;
  publishedDate: string;
  description?: string;
  pageCount?: number;
  language?: string;
  createdAt?: string;
  updatedAt?: string;
  bookCoverUrl?: string;
  groupId?: number;
  stateId?: number;
  bookId?: string;
  publisherId?: number;
  isFavorite?: boolean;
  publisher?: PublisherDTO;
  authors: AuthorDTO[];
}
