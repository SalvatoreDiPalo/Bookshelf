import { BookDTO } from "@/models/BookDTO";
import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useState } from "react";
import { StateDTO } from "@/models/StateDTO";
import { axiosInstance } from "@/utils/axios";
import { BASE_URL } from "@/utils/const";
import { useAppContext } from "@/context/AppProvider";

interface BookProps {
  item: BookDTO;
  states: StateDTO[];
}

export default function BookItem({ item, states }: BookProps) {
  const authors = item.authors.map((author) => author.name).join(" & ");

  const { updateLoading } = useAppContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const addToFavorities = async () => {
    updateLoading!();
    const response = await axiosInstance<BookDTO>(
      `${BASE_URL}/api/books/${item.isbn}/favorite`,
      { method: "POST" },
    );
    // TODO update parent list or item
    updateLoading!();
  };

  const removeFromFavorities = async () => {
    updateLoading!();
    const response = await axiosInstance<BookDTO>(
      `${BASE_URL}/api/books/${item.isbn}/favorite`,
      { method: "DELETE" },
    );
    // TODO update parent list or item
    updateLoading!();
  };

  return (
    <StyledBox className="m-h-[340px] cursor-pointer p-4">
      <Box className="relative h-[240px] w-[200px]">
        <img
          srcSet={`https://loremflickr.com/240/280/book`}
          src={`https://loremflickr.com/240/280/book`}
          alt={"Book"}
          loading="lazy"
          width={200}
          height={240}
          className="book-item-img"
          style={{ borderRadius: 8 }}
        />
      </Box>

      <Box className="flex w-[200px] flex-row flex-nowrap items-center">
        <Tooltip title={item.title}>
          <Typography variant="h6" gutterBottom noWrap width={210}>
            {item.title}
          </Typography>
        </Tooltip>

        <IconButton
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <MoreHorizIcon />
        </IconButton>
      </Box>

      <Menu
        id="basic-menu"
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
        {item.isFavorite ? (
          <MenuItem onClick={removeFromFavorities}>
            Remove from Favorities
          </MenuItem>
        ) : (
          <MenuItem onClick={addToFavorities}>Add to Favorities</MenuItem>
        )}
        <Divider sx={{ my: 0.5 }} />
        {states &&
          states.map((state) => (
            <MenuItem key={state.id} onClick={handleClose}>
              Add to "{state.name}"
            </MenuItem>
          ))}
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleClose}>Delete</MenuItem>
      </Menu>

      <Tooltip title={authors}>
        <Typography variant="subtitle1" gutterBottom noWrap width={210}>
          {authors}
        </Typography>
      </Tooltip>
    </StyledBox>
  );
}

const StyledBox = styled(Box)(({ theme }) => ({
  ":hover": {
    ".book-item-img": {
      transform: "scale(1.02)",
    },
  },
}));
