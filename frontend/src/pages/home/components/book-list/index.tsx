import { BookDTO } from "@/models/BookDTO";
import { ResultDTO } from "@/models/ResultDTO";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import BookItem from "../book-item";
import { StateDTO } from "@/models/StateDTO";
import { Typography } from "@mui/material";

interface BookListProps {
  data?: ResultDTO<BookDTO>;
  states: StateDTO[];
}

export default function BookList({ data, states }: BookListProps) {
  return data && data.items && data.items.length ? (
    data.items.map((book) => (
      <Grid
        key={book.isbn}
        xs={12}
        sm={4}
        md={3}
        xl={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <BookItem item={book} states={states} />
      </Grid>
    ))
  ) : (
    <Grid
      xs={12}
      display="flex"
      justifyContent="center"
      alignItems="center"
      className="mb-2"
    >
      <Typography>There are no books to display!</Typography>
    </Grid>
  );
}
