import { AuthorDTO } from "./author-dto";
import { PublisherDTO } from "./publisher-dto";

export interface BookDTO {
  isbn: string;
  title: string;
  subtitle: string;
  publishedDate: string;
  description: string;
  pageCount: number;
  language?: string;
  createdAt?: Date;
  updatedAt?: Date;
  publisher: PublisherDTO;
  bookCoverUrl?: number;
  authors: AuthorDTO[];
  groupId?: number;
  isFavorite?: boolean;
}

