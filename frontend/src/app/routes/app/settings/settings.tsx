import StatesList from '@/features/settings/states-list';
import { Box, Typography } from '@mui/material';

export default function Settings() {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        States
      </Typography>
      <StatesList />
    </Box>
  );
}
