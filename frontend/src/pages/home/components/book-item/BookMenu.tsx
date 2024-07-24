import { BookProps } from ".";
import { axiosInstance } from "@/utils/axios";
import { BookDTO } from "@/models/BookDTO";
import { useMemo } from "react";
import { Divider, Menu, MenuItem } from "@mui/material";

interface CustomMenuProps extends BookProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  handleClose: () => void;
}

export default function CustomMenu({
  item,
  states,
  open,
  anchorEl,
  handleClose,
  updateElement,
}: CustomMenuProps) {
  const updateFavoriteFlag = async () => {
    const url = `/library/book/${item.id}/favorite`;
    const body = { isFavorite: !item.isFavorite };
    const response = await axiosInstance.patch<BookDTO>(url, body);
    updateElement(response.data);
  };

  const updateBookState = async (id: number) => {
    const url = `/library/book/${item.id}/state`;
    const body = { stateId: id };
    const response = await axiosInstance.patch<BookDTO>(url, body);
    updateElement(response.data);
  };

  const removeBookState = async () => {
    const url = `/library/book/${item.id}/state`;
    const body = { stateId: null };
    const response = await axiosInstance.patch<BookDTO>(url, body);
    updateElement(response.data);
  };

  const Favorite = useMemo(
    () => (
      <MenuItem onClick={updateFavoriteFlag}>
        {item.isFavorite ? "Remove from Favorities" : "Add to Favorities"}
      </MenuItem>
    ),
    [item.isFavorite],
  );

  const StatesTab = useMemo(() => {
    const stateName = states.find((state) => state.id === item.stateId)?.name;

    if (item.stateId && stateName) {
      return (
        <MenuItem onClick={removeBookState}>Remove from "{stateName}"</MenuItem>
      );
    } else {
      return states && states.length > 0
        ? states.map((state) => (
            <MenuItem key={state.id} onClick={() => updateBookState(state.id)}>
              Add to "{state.name}"
            </MenuItem>
          ))
        : null;
    }
  }, [item.stateId, states]);

  return (
    <Menu
      id={`${item.isbn}-menu`}
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        "aria-labelledby": "basic-button",
      }}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              left: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        },
      }}
    >
      {Favorite}
      <Divider sx={{ my: 0.5 }} />
      {StatesTab}
      <Divider sx={{ my: 0.5 }} />
      <MenuItem onClick={handleClose}>Delete</MenuItem>
    </Menu>
  );
}
