import { Box, Paper, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { useEffect, useState } from 'react';

import { useAuth } from '@/app/main-provider';
import { StatsDTO } from '@/models/stats-dto';
import { axiosInstance } from '@/utils/axios';

import StatsCard from './components/stats-card';

export default function ProfileView() {
  const theme = useTheme();
  const [stats, setStats] = useState<StatsDTO>();
  const { user } = useAuth();

  const getStats = async () => {
    const response = await axiosInstance<StatsDTO>('/library/stats');
    setStats(response.data);
  };

  useEffect(() => {
    getStats();
  }, []);

  // TODO change username

  return (
    <Box>
      <Paper
        className="rounded-md p-4"
        elevation={4}
        sx={{ backgroundColor: theme.palette.primary.secondBackground }}
      >
        <Typography variant="h6" gutterBottom>
          {user?.username ?? 'Salvatore Di Palo'}
        </Typography>
      </Paper>
      {stats && (
        <Grid className="mt-1" container columns={12} spacing={2}>
          <Grid xs={12} sm={6} md={4}>
            <StatsCard value={stats.booksAdded} label="Books added" />
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <StatsCard value={stats.finishedBooks} label="Books read" />
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <StatsCard value={stats.favoriteBooks} label="Favorities" />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
