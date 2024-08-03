import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  List,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { StateDTO } from '@/models/state-dto';
import { axiosInstance } from '@/utils/axios';
import { reorder } from '@/utils/helpers';

import StateListEntry from './components/state-list-entry';

export default function StatesList() {
  const [items, setItems] = useState<StateDTO[]>([]);
  const [checked, setChecked] = useState(false);

  const fetchData = async () => {
    const response = await axiosInstance<StateDTO[]>(`/states`);
    setItems(response.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onDragEnd = ({ destination, source }: DropResult) => {
    // dropped outside the list
    if (!destination) return;

    const newItems = reorder(items!, source.index, destination.index);

    setItems(newItems);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const addEmptyState = () => {
    setItems((prevElem) => [
      ...prevElem,
      {
        id: -Math.floor(Math.random() * 10000),
        name: `Empty-${prevElem.length + 1}`,
        isEditable: true,
      },
    ]);
  };

  const removeFromArray = (index: number) => {
    const array = [...items];
    array.splice(index, 1);
    setItems(array);
  };

  const handleItemNameChange = (index: number, name: string) => {
    const newState = [...items];
    newState[index].name = name;
    setItems(newState);
  };

  const saveStates = async () => {
    const response = await axiosInstance<StateDTO[]>(`/states`, {
      method: 'POST',
      data: items,
    });
    setItems(response.data);
  };
  return (
    <>
      <Box className="flex flex-row flex-nowrap">
        <Box
          className="w-1/2 content-center border-2 border-solid"
          sx={{ opacity: checked ? 1 : 0.5 }}
        >
          {items && items.length ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable-list" isDropDisabled={!checked}>
                {(provided) => (
                  <List ref={provided.innerRef} {...provided.droppableProps}>
                    {items.map((item: StateDTO, index: number) => (
                      <StateListEntry
                        item={item}
                        index={index}
                        key={item.id}
                        isDisabled={!checked}
                        updateItemName={handleItemNameChange}
                        removeItem={removeFromArray}
                      />
                    ))}
                    {provided.placeholder}
                  </List>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <Typography
              sx={{ flexGrow: 1 }}
              textAlign="center"
              alignItems="center"
              alignContent="center"
              display="flex"
              justifyItems="center"
            >
              Try adding a state
            </Typography>
          )}
        </Box>
        <FormControlLabel
          className="ml-2"
          control={
            <Checkbox checked={checked} onChange={handleCheckboxChange} />
          }
          label="Modify"
        />
      </Box>
      <Box sx={{ display: checked ? 'inline-flex' : 'none' }}>
        <Button
          variant="outlined"
          className="mr-2 mt-2"
          onClick={addEmptyState}
          disabled={items.length >= 10}
        >
          Add
        </Button>
        <Button
          variant="outlined"
          className="mt-2"
          onClick={saveStates}
          disabled={!items.length}
        >
          Save
        </Button>
      </Box>
    </>
  );
}
