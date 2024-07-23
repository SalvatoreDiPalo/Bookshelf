import { Author } from "@/modules/common/author/author.entity";
import { BookWithRelations, BookWithRelationsSchema } from "@/modules/book/book.validation";

class GetLibraryMapper {
  toResponse(entity: LibraryBookIn): BookWithRelations {
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

export const getLibraryMapperInstance = new GetLibraryMapper();

export interface LibraryBookIn {
  id: number;
  isbn: string;
  title: string;
  subTitle?: string;
  publishedDate: string;
  description?: string;
  pageCount?: number;
  language?: string;
  createdAt: string;
  updatedAt: string;
  bookCoverUrl?: string;
  groupId?: number;
  bookId: string;
  publisherId?: number;
  publisherName?: string;

  authors: Author[];

  ubsId?: number;
  userId?: number;
  stateId?: number;
  isFavorite?: boolean;
}
