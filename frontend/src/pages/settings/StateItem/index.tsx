import { StateDTO } from "@/models/StateDTO";
import { Box, IconButton, ListItem, TextField, Tooltip } from "@mui/material";
import { Draggable } from "@hello-pangea/dnd";
import CancelIcon from "@mui/icons-material/Cancel";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

interface StateItemProps {
  item: StateDTO;
  index: number;
  isDisabled: boolean;
  updateItemName: (index: number, name: string) => void;
  removeItem: (index: number) => void;
}

//TODO add icon to display that the rows can be sorted
export default function StateItem({
  item,
  index,
  isDisabled,
  updateItemName,
  removeItem,
}: StateItemProps) {
  return (
    <Draggable
      draggableId={String(item.id)}
      index={index}
      isDragDisabled={isDisabled}
    >
      {(provided, snapshot) => (
        <ListItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={snapshot.isDragging ? { background: "rgb(235,235,235)" } : {}}
          className="justify-between"
        >
          <Box className="flex items-center">
            <Tooltip title="Drag Me!" disableHoverListener={isDisabled}>
              <DragIndicatorIcon />
            </Tooltip>
            {index + 1}.
            <TextField
              variant="standard"
              className="ml-2"
              value={item.name}
              disabled={!item.isEditable || isDisabled}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                updateItemName(index, event.target.value);
              }}
            />
          </Box>

          <Tooltip title="Remove">
            <IconButton
              onClick={() => removeItem(index)}
              disabled={isDisabled || !item.isEditable}
            >
              <CancelIcon />
            </IconButton>
          </Tooltip>
        </ListItem>
      )}
    </Draggable>
  );
}
