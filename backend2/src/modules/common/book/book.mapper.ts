import {
  Book,
  BookWithRelations,
  BookWithRelationsSchema,
} from "./book.entity";
import { Author } from "../author/author.entity";

class BookMapper {
  toResponseWithRelations(entity: BookDbWithRelations): BookWithRelations {
    const record: BookWithRelations = {
      authors: entity.authors,

      publisher: entity.publisherId
        ? { id: entity.publisherId, name: entity.publisherName! }
        : undefined,

      id: entity.id,
      isbn: entity.isbn,
      title: entity.title,
      subTitle: entity.subTitle ?? undefined,
      publishedDate: entity.publishedDate,
      description: entity.description ?? undefined,
      pageCount: entity.pageCount ?? undefined,
      language: entity.language ?? undefined,
      createdAt: undefined,
      updatedAt: undefined,
      bookCoverUrl: entity.bookCoverUrl ?? undefined,
      groupId: entity.groupId ?? undefined,
      stateId: entity.stateId ?? undefined,
      bookId: entity.bookId,
      isFavorite: entity.isFavorite ?? false,
    };
    return BookWithRelationsSchema.parse(record);
  }
}

export const bookMapperInstance = new BookMapper();

export interface BookDbWithRelations extends Book {
  publisherName?: string;

  authors: Author[];

  ubsId?: number;
  userId?: number;
  stateId?: number;
}
