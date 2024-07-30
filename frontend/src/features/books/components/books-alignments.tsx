import GridViewIcon from '@mui/icons-material/GridView';
import MenuIcon from '@mui/icons-material/Menu';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

interface AlignmentButtonsProps {
  alignment: number;
  setAlignment: (value: number) => void;
}

export default function BooksAlignments({
  alignment,
  setAlignment,
}: AlignmentButtonsProps) {
  const handleAlignment = (
    _: React.MouseEvent<HTMLElement>,
    newAlignment: number,
  ) => {
    setAlignment(newAlignment);
  };

  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      defaultValue={0}
      onChange={handleAlignment}
      color="primary"
      sx={{ height: '100%' }}
    >
      <ToggleButton value={0} aria-label="left aligned">
        <GridViewIcon />
      </ToggleButton>
      <ToggleButton value={1} aria-label="centered">
        <MenuIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
