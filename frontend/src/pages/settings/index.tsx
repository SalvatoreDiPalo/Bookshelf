import { StateDTO } from "@/models/StateDTO";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import StateList from "./StateList";
import { reorder } from "@/utils/helpers";
import { DropResult } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/utils/const";
import { axiosInstance } from "@/utils/axios";
import { useAppContext } from "@/context/AppProvider";

export default function Settings() {
  const { updateLoading } = useAppContext();

  const [items, setItems] = useState<StateDTO[]>([]);
  const [checked, setChecked] = useState(false);

  const fetchData = async () => {
    updateLoading!();
    const response = await axiosInstance<StateDTO[]>(`${BASE_URL}/api/states`);
    console.log("Response", response);
    setItems(response.data);
    updateLoading!();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onDragEnd = ({ destination, source }: DropResult) => {
    console.log("Destination", destination, "Source", source);
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
    var array = [...items];
    array.splice(index, 1);
    setItems(array);
  };

  const handleItemNameChange = (index: number, name: string) => {
    const newState = [...items];
    newState[index].name = name;
    setItems(newState);
  };

  const saveStates = async () => {
    updateLoading!();
    const response = await axiosInstance<StateDTO[]>(`${BASE_URL}/api/states`, {
      method: "POST",
      data: items,
    });
    console.log("Response Post", response);
    setItems(response.data);
    updateLoading!();
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        States
      </Typography>
      <Box className="flex flex-row flex-nowrap">
        <Box
          className="w-1/2 border-2 border-solid"
          sx={{ opacity: checked ? 1 : 0.5 }}
        >
          {items && (
            <StateList
              items={items}
              onDragEnd={onDragEnd}
              isDragDisabled={!checked}
              updateItemName={handleItemNameChange}
              removeItem={removeFromArray}
            />
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
      <Box sx={{ display: checked ? "inline-flex" : "none" }}>
        <Button
          variant="outlined"
          className="mr-2 mt-2"
          onClick={addEmptyState}
        >
          Add
        </Button>
        <Button variant="outlined" className="mt-2" onClick={saveStates}>
          Save
        </Button>
      </Box>
    </Box>
  );
}
