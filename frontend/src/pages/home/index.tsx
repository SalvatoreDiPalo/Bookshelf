import { UserInfoResponse, useLogto } from "@logto/react";
import { useEffect, useState } from "react";
import {
  Box,
  Pagination,
  Paper,
  SelectChangeEvent,
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
import axios from "axios";
import { itemsPerPage } from "@/utils/const";

const StyledTabs = styled(Tabs)<TabsProps>(({ theme }) => ({
  overflow: "hidden",
  display: "flex",
  backgroundColor: "grey", // TODO change this one rgb(238, 238, 238);
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
    margin: "0 3px",
  },
}));

export default function Home() {
  const { isAuthenticated, fetchUserInfo, getAccessToken } = useLogto();
  const [user, setUser] = useState<UserInfoResponse>();
  const [accessToken, setAccessToken] = useState("ciao");
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [alignment, setAlignment] = useState<number>(0);
  const [books, setBooks] = useState<ResultDTO<BookDTO>>();
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        const userInfo = await fetchUserInfo();
        const token = await getAccessToken("http://localhost:3001");
        await setAccessToken(token ?? "");
        console.log("Token", token);
        setUser(userInfo);
        await requestApi(page, itemsPerPage);
      }
    })();
  }, [fetchUserInfo, getAccessToken, isAuthenticated]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleSortChange = (sortBy: string) => {
    console.log("Sortby", sortBy);
    requestApi(page, itemsPerPage, sortBy);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
    requestApi(page, itemsPerPage);
  };

  const requestApi = async (
    page: number = 1,
    pageSize: number = 20,
    sortBy: string = "title",
  ) => {
    const response = await axios.get<ResultDTO<BookDTO>>(
      "http://localhost:3001/api/books",
      {
        params: {
          page: page,
          pageSize: pageSize,
          sortBy: sortBy,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    setBooks(response.data);
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
          scrollButtons={false}
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
          <Tab disableRipple label="In Progress" />
          <Tab disableRipple label="Finished" />
          <Tab disableRipple label="Item Five" />
          <Tab disableRipple label="Item Six" />
          <Tab disableRipple label="Item Seven" />
        </StyledTabs>
        <Box>
          <SelectSort updateSort={handleSortChange} />
          <AlignmentButtons alignment={alignment} setAlignment={setAlignment} />
        </Box>
      </Box>
      <Grid container columns={alignment === 0 ? 12 : 1}>
        {books &&
          books.items &&
          books.items.map((book) => (
            <Grid
              key={book.isbn}
              xs={12}
              sm={4}
              md={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <BookItem item={book} />
            </Grid>
          ))}
        <Grid xs={12} justifyContent="center" display="flex">
          <Pagination
            count={books?.totalItems ?? 1 / page}
            page={page}
            onChange={handlePageChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
