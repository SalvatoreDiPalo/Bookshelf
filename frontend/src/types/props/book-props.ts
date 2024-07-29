import { BookDTO } from '@/models/book-dto';
import { StateDTO } from '@/models/state-dto';

export interface BookListProps {
  states: StateDTO[];
  isSingleLine: boolean;
  sortBy: string;
  selectedTab: number;
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
