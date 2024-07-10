import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";

interface SelectSortProps {
  updateSort: (value: string) => void;
}

export default function SelectSort({ updateSort }: SelectSortProps) {
  const [sortBy, setSortBy] = useState<string>("title");
  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
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
        <MenuItem value={"title"}>Title</MenuItem>
        <MenuItem value={"createdDate"}>Date</MenuItem>
      </Select>
    </FormControl>
  );
}
