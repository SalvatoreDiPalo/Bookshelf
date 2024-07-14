import { StateDTO } from "@/models/StateDTO";
import { List } from "@mui/material";
import { memo } from "react";
import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import StateItem from "../StateItem";

export type Props = {
  isDragDisabled: boolean;
  items: StateDTO[];
  onDragEnd: OnDragEndResponder;
  updateItemName: (index: number, name: string) => void;
  removeItem: (index: number) => void;
};

const StateList = memo(
  ({ isDragDisabled, items, onDragEnd, updateItemName, removeItem }: Props) => {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-list" isDropDisabled={isDragDisabled}>
          {(provided) => (
            <List ref={provided.innerRef} {...provided.droppableProps}>
              {items.map((item: StateDTO, index: number) => (
                <StateItem
                  item={item}
                  index={index}
                  key={item.id}
                  isDisabled={isDragDisabled}
                  updateItemName={updateItemName}
                  removeItem={removeItem}
                />
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    );
  },
);

export default StateList;
