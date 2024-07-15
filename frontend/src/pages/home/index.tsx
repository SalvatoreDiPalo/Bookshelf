import { useState } from "react";
import {
  Box,
  Pagination,
  Skeleton,
  Tab,
  Tabs,
  TabsProps,
  styled,
} from "@mui/material";
import AlignmentButtons from "./components/alignment-buttons";
import SelectSort from "./components/select-sort";
import BookItem from "./components/book-item";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { BookDTO } from "@/models/BookDTO";
import { ResultDTO } from "@/models/ResultDTO";
import { useRequest } from "@/hooks/useRequest";
import { StateDTO } from "@/models/StateDTO";
import { ITEMS_PER_PAGE } from "@/utils/const";

const StyledTabs = styled(Tabs)<TabsProps>(({ theme }) => ({
  overflow: "hidden",
  display: "flex",
  backgroundColor: "#F4F5F9", // TODO change this one rgb(238, 238, 238);
  borderRadius: 10,
  minHeight: 44,
  maxWidth: "60%",
  "& .MuiTabs-flexContainer": {
    position: "relative",
    height: "100%",
    zIndex: 1,
    paddingVertical: 0,
    paddingHorizontal: 3,
  },
  "& .MuiTabs-scrollableX": {
    margin: "0 0",
  },
  ".MuiTabs-scrollButtons.Mui-disabled": {
    opacity: 0.3,
  },
}));

export default function Home() {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [alignment, setAlignment] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("title");
  const { data, error, isLoading, setRefetch } = useRequest<ResultDTO<BookDTO>>(
    {
      url: "/books",
      params: {
        page: page,
        pageSize: ITEMS_PER_PAGE,
        sortBy: sortBy,
      },
    },
  );

  const { data: states, isLoading: areStatesLoading } = useRequest<StateDTO[]>({
    url: "/states",
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleSortChange = (sortBy: string) => {
    setSortBy(sortBy);
    setPage(1);
    getBooks(1, sortBy);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    if (page == value) {
      return;
    }
    setPage(value);
    getBooks(value, sortBy);
  };

  const getBooks = async (page: number = 1, sortBy: string = "title") => {
    console.log("RequestApi", page, sortBy);
    setRefetch({
      url: "/books",
      params: {
        page: page,
        pageSize: ITEMS_PER_PAGE,
        sortBy: sortBy,
      },
    });
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <StyledTabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons={true}
          allowScrollButtonsMobile
          TabIndicatorProps={{
            sx: {
              top: 3,
              bottom: 3,
              right: 3,
              height: "auto",
              borderRadius: 2,
              backgroundColor: "rgb(255, 255, 255)",
            },
          }}
        >
          <Tab disableRipple label="All" />
          <Tab disableRipple label="Favorities" />
          {states &&
            states.map((state: StateDTO) => (
              <Tab key={state.id} label={state.name} disableRipple />
            ))}
        </StyledTabs>
        <Box sx={{ display: "flex", flexFlow: "row nowrap" }}>
          <SelectSort sortBy={sortBy} updateSort={handleSortChange} />
          <AlignmentButtons alignment={alignment} setAlignment={setAlignment} />
        </Box>
      </Box>
      <Grid container columns={alignment === 0 ? 12 : 1}>
        {!isLoading && data && states && data.items
          ? data.items.map((book) => (
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
          : Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width={210}
                height={280}
                sx={{ margin: 2 }}
              />
            ))}
        <Grid xs={12} justifyContent="center" display="flex">
          <Pagination
            count={Math.ceil((data?.totalItems ?? 1) / ITEMS_PER_PAGE)}
            page={page}
            onChange={handlePageChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
