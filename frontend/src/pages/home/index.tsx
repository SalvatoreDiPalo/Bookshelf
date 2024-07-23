import { useEffect, useState } from "react";
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
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { BookDTO } from "@/models/BookDTO";
import { ResultDTO } from "@/models/ResultDTO";
import { StateDTO } from "@/models/StateDTO";
import { ITEMS_PER_PAGE } from "@/utils/const";
import { axiosInstance } from "@/utils/axios";
import BookList from "./components/book-list";

const StyledTabs = styled(Tabs)<TabsProps>(({ theme }) => ({
  overflow: "hidden",
  display: "flex",
  borderRadius: 10,
  minHeight: 44,
  maxWidth: "100%",
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
  const [data, setData] = useState<ResultDTO<BookDTO>>();
  const [states, setStates] = useState<StateDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchBooks = async (
    page: number = 1,
    sortBy: string = "title",
    otherQueryOptions?: FetchBookProp,
  ) => {
    setIsLoading(true);
    const response = await axiosInstance<ResultDTO<BookDTO>>(`/library`, {
      params: {
        page: page,
        pageSize: ITEMS_PER_PAGE,
        sortBy: sortBy,
        ...otherQueryOptions,
      },
    });
    setData(response.data);
    setIsLoading(false);
  };

  const fetchStates = async () => {
    const response = await axiosInstance<StateDTO[]>(`/states`);
    setStates(response.data);
  };

  useEffect(() => {
    fetchBooks();
    fetchStates();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    // Favorities
    switch (newValue) {
      case 0:
        fetchBooks(page, sortBy);
        break;
      case 1:
        fetchBooks(page, sortBy, { isFavorite: true });
        break;
      default:
        fetchBooks(page, sortBy, { stateId: states[newValue - 2].id });
        break;
    }
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
    fetchBooks(page, sortBy);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexFlow: "row wrap",
          gap: 1,
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
          {states.map((state: StateDTO) => (
            <Tab key={state.id} label={state.name} />
          ))}
        </StyledTabs>
        <Box sx={{ display: "flex", flexFlow: "row nowrap" }}>
          <SelectSort sortBy={sortBy} updateSort={handleSortChange} />
          <AlignmentButtons alignment={alignment} setAlignment={setAlignment} />
        </Box>
      </Box>
      <Grid container columns={alignment === 0 ? 12 : 1}>
        {!isLoading ? (
          <BookList data={data} states={states} setData={setData} />
        ) : (
          Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width={210}
              height={280}
              sx={{ margin: 2 }}
            />
          ))
        )}
        <Grid xs={12} justifyContent="center" display="flex">
          <Pagination
            count={Math.ceil(
              (data?.totalItems && data?.totalItems > 1
                ? data?.totalItems
                : 1) / ITEMS_PER_PAGE,
            )}
            page={page}
            onChange={handlePageChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

interface FetchBookProp {
  isFavorite?: boolean;
  stateId?: number;
}
