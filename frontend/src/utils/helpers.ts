import { Volume } from '@/models/google-volumes';
import { BookDTO } from '@/models/book-dto';
import { env } from './env';

export const reorder = <T>(
  list: T[],
  startIndex: number,
  endIndex: number,
): T[] => {
  const [removed] = list.splice(startIndex, 1);
  list.splice(endIndex, 0, removed);

  return list;
};

export const getToken = () => {
  const accessTokenObject: any = JSON.parse(
    localStorage.getItem(`logto:${env.LOGTO_APPID}:accessToken`) ?? '{}',
  );
  const accessToken = accessTokenObject[`@${env.API_URL}`];
  return accessToken?.token || '';
};

export const volumeToBookDTO = (volume: Volume): BookDTO => {
  const volumeInfo = volume.volumeInfo;
  const isbn13Identifier = volume.volumeInfo.industryIdentifiers.find(
    (identifier) => identifier.type === 'ISBN_13',
  );

  return {
    isbn: isbn13Identifier?.identifier ?? '',
    title: volumeInfo.title,
    subTitle: volumeInfo.subtitle,
    publishedDate: volumeInfo.publishedDate,
    description: volumeInfo.description,
    pageCount: volumeInfo.pageCount,
    language: volumeInfo.language,
    bookId: volume.id,
    isFavorite: false,
    publisher: volumeInfo.publisher
      ? {
          id: 1,
          name: volumeInfo.publisher,
        }
      : undefined,
    authors: (volumeInfo.authors ?? []).map((name) => {
      return {
        id: 1,
        name: name,
      };
    }),
  };
};

/**
 * Remove "Invalid attribute name: " warning when using styled components with custom properties
 * @param prop property
 */
export const shouldForwardProp = (prop: PropertyKey) => prop !== 'isSingleLine';
