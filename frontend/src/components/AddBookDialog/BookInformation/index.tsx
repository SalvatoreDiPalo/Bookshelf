import { BookDTO } from "@/models/BookDTO";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

interface BookInformationProps {
  data?: BookDTO;
}

export default function BookInformation({ data }: BookInformationProps) {
  if (!data) return null;

  return (
    <Grid container columns={12}>
      <Grid
        xs={12}
        md={6}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box className="relative w-[200px]">
          <img
            srcSet={`https://loremflickr.com/240/280/book`}
            src={`https://loremflickr.com/240/280/book`}
            alt={"Book"}
            loading="lazy"
            width={200}
            height={240}
            className="book-item-img"
            style={{ borderRadius: 8 }}
          />
        </Box>
      </Grid>
      <Grid xs={12} md={6}>
        <Typography variant="h6">{data.title}</Typography>
        {data.subtitle && (
          <Typography variant="body2" gutterBottom>
            {data.subtitle}
          </Typography>
        )}
        <Typography variant="subtitle2" noWrap>
          {data.authors.map((author) => author.name)}
        </Typography>
        {data.publisher && (
          <Typography variant="caption" noWrap gutterBottom>
            {data.publisher.name}
          </Typography>
        )}
        <Typography
          variant="body2"
          gutterBottom
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 9,
          }}
        >
          {data.description}
        </Typography>
      </Grid>
    </Grid>
  );
}
