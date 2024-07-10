import { BookDTO } from "@/models/BookDTO";
import { Box, Paper, Tooltip, Typography, styled } from "@mui/material";

interface BookProps {
  item: BookDTO;
}

export default function BookItem({ item }: BookProps) {
  const authors = item.authors.map((author) => author.name).join(" & ");

  return (
    <StyledBox sx={{ padding: 2, maxHeight: 350, cursor: "pointer" }}>
      <Paper sx={{ borderRadius: 8 }}>
        <img
          srcSet={`https://loremflickr.com/240/280/book`}
          src={`https://loremflickr.com/240/280/book`}
          alt={"Book"}
          loading="lazy"
          style={{ borderRadius: 8 }}
        />
      </Paper>
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
    ".MuiPaper-root": {
      transform: "scale(1.02)",
    },
  },
}));
