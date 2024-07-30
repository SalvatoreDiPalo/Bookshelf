import { Box, Divider, Tab, Tabs, styled } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { useEffect, useState } from 'react';

import BooksList from '@/features/books/books-list';
import BooksAlignments from '@/features/books/components/books-alignments';
import BooksSelectSort from '@/features/books/components/books-select-sort';
import { StateDTO } from '@/models/state-dto';
import { axiosInstance } from '@/utils/axios';

const StyledTabs = styled(Tabs)(() => ({
  overflow: 'hidden',
  display: 'flex',
  borderRadius: 10,
  minHeight: 44,
  maxWidth: '100%',
  '& .MuiTabs-flexContainer': {
    position: 'relative',
    height: '100%',
    zIndex: 1,
    paddingVertical: 0,
    paddingHorizontal: 3,
  },
  '& .MuiTabs-scrollableX': {
    margin: '0 0',
  },
  '.MuiTabs-scrollButtons.Mui-disabled': {
    opacity: 0.3,
  },
}));

export default function Books() {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [alignment, setAlignment] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('title');
  const [states, setStates] = useState<StateDTO[]>([]);

  const fetchStates = async () => {
    const response = await axiosInstance<StateDTO[]>(`/states`);
    setStates(response.data);
  };

  useEffect(() => {
    fetchStates();
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleSortChange = (sortBy: string) => {
    setSortBy(sortBy);
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexFlow: 'row wrap',
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
              height: 'auto',
              borderRadius: 2,
              backgroundColor: 'rgb(255, 255, 255)',
            },
          }}
        >
          <Tab disableRipple label="All" />
          <Tab disableRipple label="Favorities" />
          {states.map((state: StateDTO) => (
            <Tab key={state.id} label={state.name} />
          ))}
        </StyledTabs>
        <Box sx={{ display: 'flex', flexFlow: 'row nowrap' }}>
          <BooksSelectSort sortBy={sortBy} updateSort={handleSortChange} />
          <BooksAlignments alignment={alignment} setAlignment={setAlignment} />
        </Box>
      </Box>
      <Grid container columns={alignment === 0 ? 12 : 1} spacing={2}>
        <BooksList
          states={states}
          sortBy={sortBy}
          selectedTab={selectedTab}
          isSingleLine={alignment === 1}
        />
        <Grid xs={12}>
          <Divider />
        </Grid>
      </Grid>
    </Box>
  );
}
