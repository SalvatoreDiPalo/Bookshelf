import { Pagination, Skeleton, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { useEffect, useState } from 'react';

import { useLoading } from '@/app/loading-provider';
import { useAuth } from '@/app/main-provider';
import { BookDTO } from '@/models/book-dto';
import { ResultDTO } from '@/models/result-dto';
import { StateDTO } from '@/models/state-dto';
import { BookListProps } from '@/types/props/book-props';
import { axiosInstance } from '@/utils/axios';
import { env } from '@/utils/env';

import BookListEntry from './components/books-list-entry';

export default function BooksList({
  states,
  sortBy,
  selectedTab,
  isSingleLine,
}: BookListProps) {
  const [data, setData] = useState<ResultDTO<BookDTO>>();
  const [page, setPage] = useState<number>(1);
  const { shouldReloadComponent } = useAuth();
  const { isLoading } = useLoading();

  const fetchBooks = async (
    page: number = 1,
    sortBy: string = 'title',
    otherQueryOptions?: FetchBookProp,
  ) => {
    const response = await axiosInstance<ResultDTO<BookDTO>>(`/library`, {
      params: {
        page: page,
        pageSize: env.BOOKS_ITEMS_PER_PAGE,
        sortBy: sortBy,
        ...otherQueryOptions,
      },
    });
    setData(response.data);
  };

  useEffect(() => {
    console.log('Fetch Books', sortBy, selectedTab);
    fetchBooks(page, sortBy, getOtherProps(selectedTab, states));
  }, [sortBy, selectedTab]);

  // This will force the component to re-render
  useEffect(() => {
    console.log('Should reload component', shouldReloadComponent);
    if (shouldReloadComponent) {
      const otherProps = getOtherProps(selectedTab, states);
      fetchBooks(page, sortBy, otherProps);
    }
  }, [shouldReloadComponent]);

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

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    if (page == value) {
      return;
    }
    setPage(value);
    fetchBooks(value, sortBy);
  };

  if (isLoading) {
    return Array.from({ length: env.BOOKS_ITEMS_PER_PAGE }).map((_, index) => (
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
          width={'100%'}
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

  return (
    <>
      {data.items.map((book) => (
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
          <BookListEntry
            item={book}
            states={states}
            isSingleLine={isSingleLine}
            updateElement={updateElement}
            removeElement={removeElement}
          />
        </Grid>
      ))}
      <Grid xs={12} justifyContent="center" display="flex" marginTop={2}>
        <Pagination
          count={Math.ceil(
            (data?.totalItems && data?.totalItems > 1 ? data?.totalItems : 1) /
              env.BOOKS_ITEMS_PER_PAGE,
          )}
          color="primary"
          page={page}
          onChange={handlePageChange}
        />
      </Grid>
    </>
  );
}

interface FetchBookProp {
  isFavorite?: boolean;
  stateId?: number;
}

function getOtherProps(
  newValue: number,
  states: StateDTO[],
): FetchBookProp | undefined {
  switch (newValue) {
    case 0:
      return;
    case 1:
      return { isFavorite: true };
    default:
      return { stateId: states[newValue - 2].id };
  }
}
