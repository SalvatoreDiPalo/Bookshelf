import { BookDTO } from "@/models/BookDTO";
import { Box, Tooltip, Typography, styled } from "@mui/material";

interface BookProps {
  item: BookDTO;
}

export default function BookItem({ item }: BookProps) {
  const authors = item.authors.map((author) => author.name).join(" & ");

  return (
    <StyledBox sx={{ padding: 2, maxHeight: 340, cursor: "pointer" }}>
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
