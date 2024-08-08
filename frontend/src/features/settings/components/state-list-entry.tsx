import CancelIcon from '@mui/icons-material/Cancel';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Box, IconButton, ListItem, TextField, Tooltip } from '@mui/material';

import { StateItemProps } from '@/types/props/state-props';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function StateListEntry({
  item,
  index,
  updateItemName,
  removeItem,
}: StateItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ListItem
      className="justify-between"
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <Box className="flex items-center">
        <Tooltip title="Drag Me!">
          <DragIndicatorIcon {...listeners} />
        </Tooltip>
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
