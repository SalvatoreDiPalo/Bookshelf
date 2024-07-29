import { BookDTO } from '@/models/BookDTO';
import { ResultDTO } from '@/models/ResultDTO';
import { StateDTO } from '@/models/StateDTO';
import { Dispatch, SetStateAction } from 'react';

export interface BookListProps {
  states: StateDTO[];
  isSingleLine: boolean;
  sortBy: string;
  selectedTab: number;
  setData: Dispatch<SetStateAction<ResultDTO<BookDTO> | undefined>>;
}

export interface BookProps {
  item: BookDTO;
  states: StateDTO[];
  isSingleLine?: boolean;
  updateElement: (item: BookDTO) => void;
  removeElement: (item: BookDTO) => void;
}

export interface BookListMenuProps extends BookProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  handleClose: () => void;
}

export interface BooksSelectSortProps {
  sortBy: string;
  updateSort: (value: string) => void;
}

