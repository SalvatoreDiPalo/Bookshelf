import CancelIcon from '@mui/icons-material/Cancel';
import { Box, IconButton, ListItem, TextField, Tooltip } from '@mui/material';

import { StateItemProps } from '@/types/props/state-props';

export default function StateListEntry({
  item,
  index,
  updateItemName,
  removeItem,
}: StateItemProps) {
  return (
    <ListItem className="justify-between">
      <Box className="flex items-center">
        {index + 1}.
        <TextField
          variant="standard"
          className="ml-2"
          value={item.name}
          disabled={!item.isEditable}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            updateItemName(index, event.target.value);
          }}
        />
      </Box>

      <Tooltip title="Remove">
        <IconButton
          onClick={() => removeItem(index)}
          disabled={!item.isEditable}
        >
          <CancelIcon />
        </IconButton>
      </Tooltip>
    </ListItem>
  );
}
