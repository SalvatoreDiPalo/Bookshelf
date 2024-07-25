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
    <StyledBox className="max-h-[250px] w-full max-w-[164px] cursor-pointer">
      <Box className="relative max-h-[164px] w-full">
        <img
          srcSet={`https://loremflickr.com/240/280/book`}
          src={`https://loremflickr.com/240/280/book`}
          alt={"Book"}
          loading="lazy"
          width={"100%"}
          height={"100%"}
          className="book-item-img"
          style={{ borderRadius: 8, aspectRatio: "1 / 1" }}
        />
        <IconButton
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
          }}
        >
          <MoreHorizIcon />
        </IconButton>
      </Box>

      <Tooltip title={item.title}>
        <Typography variant="subtitle2" noWrap>
          {item.title}
        </Typography>
      </Tooltip>

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
        <Typography variant="caption" noWrap>
          By {authors && authors.length ? authors : "N/A"}
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
