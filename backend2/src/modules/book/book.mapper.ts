import { Volume } from "@/libs/models/google-volumes";
import { Book, BookSchema } from "./book.validation";
import { Publisher } from "../common/publisher/publisher.entity";
import { Author } from "../common/author/author.entity";

class BookMapper {
  toPersistence(
    isbn: string,
    googleVolume: Volume,
    authors: Author[],
    publisher?: Publisher
  ): Book {
    const bookInfo: Book = {
      isbn: isbn,
      bookId: googleVolume.id,
      title: googleVolume.volumeInfo.title,
      subTitle: googleVolume.volumeInfo.subtitle,
      publishedDate: googleVolume.volumeInfo.publishedDate,
      description: googleVolume.volumeInfo.description,
      pageCount: googleVolume.volumeInfo.pageCount,
      publisher: publisher,
      authors: authors,
      isFavorite: false,
    };
    return BookSchema.parse(bookInfo);
  }
}

export const bookMapperInstance = new BookMapper();
