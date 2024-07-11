import { BookDTO } from "@/models/BookDTO";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import StarsIcon from "@mui/icons-material/Stars";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

interface BookProps {
  item: BookDTO;
}

export default function BookItem({ item }: BookProps) {
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
    <StyledBox sx={{ padding: 2, maxHeight: 340, cursor: "pointer" }}>
      <Box sx={{ width: 200, height: 240, position: "relative" }}>
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

        <IconButton
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          sx={{ position: "absolute", top: 8, right: 0 }}
        >
          <MenuIcon />
        </IconButton>

        <Tooltip title="Add to favorities">
          <IconButton
            aria-label="Add to favorities"
            sx={{ position: "absolute", bottom: 8, left: 0 }}
          >
            <StarsIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
      <Tooltip title={item.title}>
        <Typography variant="h6" gutterBottom noWrap width={210}>
          {item.title}
        </Typography>
      </Tooltip>
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
