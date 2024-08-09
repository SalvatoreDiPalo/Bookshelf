import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { StateDTO } from '@/models/state-dto';
import { axiosInstance } from '@/utils/axios';
import StateListEntry from './components/state-list-entry';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import { SortableList } from '@/components/ui/sortable-list';

export default function StatesList() {
  const [items, setItems] = useState<StateDTO[]>([]);

  const fetchData = async () => {
    const response = await axiosInstance<StateDTO[]>(`/states`);
    setItems(response.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    console.log('HandleDragEnd', event);
    if (!active || !over) return;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id == active.id);
        const newIndex = items.findIndex((item) => item.id == over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <>
      <Box className="w-full content-center overflow-hidden border-2 border-solid">
        {items && items.length ? (
          <SortableList
            items={items}
            onChange={setItems}
            renderItem={(item, index) => (
              <SortableList.Item id={item.id}>
                <SortableList.DragHandle />
                <StateListEntry
                  item={item}
                  index={index}
                  key={item.id}
                  updateItemName={handleItemNameChange}
                  removeItem={removeFromArray}
                />
              </SortableList.Item>
            )}
          />
        ) : (
          <Typography textAlign="center" display="flex" justifyContent="center">
            Try adding a state
          </Typography>
        )}
      </Box>
      <Box>
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

/*

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId="droppable-list"
              direction="vertical"
              mode="standard"
            >
              {(provided) => (
                <List ref={provided.innerRef} {...provided.droppableProps}>
                  {items.map((item: StateDTO, index: number) => (
                    <StateListEntry
                      item={item}
                      index={index}
                      key={item.id}
                      updateItemName={handleItemNameChange}
                      removeItem={removeFromArray}
                    />
                  ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>

*/
