import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GridViewIcon from "@mui/icons-material/GridView";

interface AlignmentButtonsProps {
  alignment: number;
  setAlignment: (value: number) => void;
}

export default function AlignmentButtons({
  alignment,
  setAlignment,
}: AlignmentButtonsProps) {
  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
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
      sx={{ height: "100%" }}
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
