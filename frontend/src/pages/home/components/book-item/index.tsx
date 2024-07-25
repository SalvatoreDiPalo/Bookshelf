import { BookDTO } from "@/models/BookDTO";
import { Box, IconButton, Tooltip, Typography, styled } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useState } from "react";
import { StateDTO } from "@/models/StateDTO";
import CustomMenu from "./BookMenu";

export interface BookProps {
  item: BookDTO;
  states: StateDTO[];
  updateElement: (item: BookDTO) => void;
  removeElement: (item: BookDTO) => void;
}

export default function BookItem({
  item,
  states,
  updateElement,
  removeElement,
}: BookProps) {
  const authors = item.authors.map((author) => author.name).join(" & ");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

      <CustomMenu
        item={item}
        anchorEl={anchorEl}
        handleClose={handleClose}
        open={open}
        states={states}
        updateElement={updateElement}
        removeElement={removeElement}
      />

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
