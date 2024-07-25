import { BookDTO } from "@/models/BookDTO";
import {
  Box,
  IconButton,
  Theme,
  Tooltip,
  Typography,
  makeStyles,
  styled,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useState } from "react";
import { StateDTO } from "@/models/StateDTO";
import CustomMenu from "./BookMenu";

export interface BookProps {
  item: BookDTO;
  states: StateDTO[];
  isSingleLine?: boolean;
  updateElement: (item: BookDTO) => void;
  removeElement: (item: BookDTO) => void;
}

export default function BookItem({
  item,
  states,
  isSingleLine,
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
    <StyledBox isSingleLine={isSingleLine ?? false}>
      <Box className="relative max-h-[164px]">
        <Image
          srcSet={`https://loremflickr.com/240/280/book`}
          src={`https://loremflickr.com/240/280/book`}
          alt={"Book"}
          loading="lazy"
          className="book-item-img"
          isSingleLine={isSingleLine ?? false}
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

      <Box>
        <Tooltip title={item.title}>
          <Typography variant="subtitle2" noWrap>
            {item.title}
          </Typography>
        </Tooltip>
        <Tooltip title={authors}>
          <Typography variant="caption" noWrap>
            By {authors && authors.length ? authors : "N/A"}
          </Typography>
        </Tooltip>
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
    </StyledBox>
  );
}

export interface StyleProps {
  isSingleLine: boolean;
}

const StyledBox = styled(Box)<StyleProps>(({ theme, isSingleLine }) => ({
  maxHeight: 250,
  width: "100%",
  maxWidth: isSingleLine ? "none" : 164,
  cursor: "pointer",
  ":hover": {
    ".book-item-img": {
      transform: "scale(1.02)",
    },
  },
  ...(isSingleLine && {
    display: "flex",
    flexFlow: "row",
    marginRight: 2
  }),
}));

const Image = styled("img")<StyleProps>(({ theme, isSingleLine }) => ({
  ...(!isSingleLine
    ? {
        height: "100%",
        width: "100%",
      }
    : {
        maxHeight: 164,
        maxWidth: 86,
      }),
  borderRadius: 8,
  aspectRatio: "1 / 1",
}));
