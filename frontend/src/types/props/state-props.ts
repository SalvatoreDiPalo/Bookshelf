import { StateDTO } from '@/models/state-dto';

export interface StateItemProps {
  item: StateDTO;
  index: number;
  isDisabled: boolean;
  updateItemName: (index: number, name: string) => void;
  removeItem: (index: number) => void;
}
