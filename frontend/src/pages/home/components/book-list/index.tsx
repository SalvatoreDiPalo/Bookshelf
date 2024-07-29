import { BookDTO } from "@/models/BookDTO";
import { ResultDTO } from "@/models/ResultDTO";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import BookItem from "../book-item";
import { StateDTO } from "@/models/StateDTO";
import { Skeleton, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { ITEMS_PER_PAGE } from "@/utils/const";

interface BookListProps {
  states: StateDTO[];
  data?: ResultDTO<BookDTO>;
  isLoading?: boolean;
  isSingleLine: boolean;
  setData: Dispatch<SetStateAction<ResultDTO<BookDTO> | undefined>>;
}

export default function BookList({
  isLoading,
  data,
  states,
  isSingleLine,
  setData,
}: BookListProps) {
  const updateElement = (item: BookDTO) => {
    setData((prevValue) => ({
      ...prevValue,
      items: prevValue!.items.map((book) =>
        book.isbn === item.isbn ? item : book,
      ),
      totalItems: prevValue!.totalItems,
    }));
  };

  const removeElement = (item: BookDTO) => {
    setData((prevValue) => ({
      ...prevValue,
      items: prevValue!.items.filter((book) => book.id !== item.id),
      totalItems: prevValue!.totalItems,
    }));
  };

  if (isLoading) {
    return Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
      <Grid
        key={index}
        xs={12}
        sm={4}
        md={3}
        xl={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Skeleton
          key={index}
          variant="rectangular"
          width={"100%"}
          height={120}
        />
      </Grid>
    ));
  }

  if (!data || !data.items || !data.items.length) {
    return (
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

  return data.items.map((book) => (
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
      <BookItem
        item={book}
        states={states}
        isSingleLine={isSingleLine}
        updateElement={updateElement}
        removeElement={removeElement}
      />
    </Grid>
  ));
}
