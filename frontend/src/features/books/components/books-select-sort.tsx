import { BooksSelectSortProps } from '@/types/props/book-props';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

export default function BooksSelectSort({
  sortBy,
  updateSort,
}: BooksSelectSortProps) {
  const handleSortChange = (event: SelectChangeEvent) => {
    updateSort(event.target.value as string);
  };
  return (
    <FormControl sx={{ width: 120, marginRight: 2 }}>
      <InputLabel id="sort-select-label">Sort by</InputLabel>
      <Select
        labelId="sort-select-label"
        id="sort-select"
        value={sortBy}
        label="Sort By"
        onChange={handleSortChange}
      >
        <MenuItem value={'title'}>Title</MenuItem>
        <MenuItem value={'createdDate'}>Date</MenuItem>
      </Select>
    </FormControl>
  );
}
