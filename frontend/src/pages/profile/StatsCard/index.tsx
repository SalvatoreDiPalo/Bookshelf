import { Box, Divider, Paper, Typography, useTheme } from "@mui/material";

interface StatsCardProps {
  value: number;
  label: string;
}

export default function StatsCard({ value, label }: StatsCardProps) {
  const theme = useTheme();
  return (
    <Paper
      className="rounded-md p-4"
      elevation={4}
      sx={{ backgroundColor: theme.palette.primary.secondBackground }}
    >
      <Box className="flex justify-between rounded-md">
        <Typography variant="h3" color={theme.palette.primary.main}>
          {value}
        </Typography>
        <Typography variant="body2" alignContent="end" textAlign="end">
          {label}
        </Typography>
      </Box>
      <Divider />
    </Paper>
  );
}
