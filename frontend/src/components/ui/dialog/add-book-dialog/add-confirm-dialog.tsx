import { Volume } from '@/models/google-volumes';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

interface BookInformationProps {
  data: Volume;
}

interface ConfirmDialogProps extends BookInformationProps {
  isInLibrary: boolean;
  open: boolean;
  handleClose: (volume?: Volume) => void;
}

export default function AddConfirmDialog({
  isInLibrary,
  open,
  data,
  handleClose,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={() => handleClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Do you want to add the book to the library?
      </DialogTitle>
      <DialogContent>
        <BookInformation data={data} />
      </DialogContent>
      <DialogActions>
        {isInLibrary && <Typography>Already present in the library</Typography>}
        <Button onClick={() => handleClose()}>No</Button>
        <Button
          onClick={() => handleClose(data)}
          autoFocus
          disabled={isInLibrary}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const BookInformation = ({ data }: BookInformationProps) => {
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
            alt={'Book'}
            loading="lazy"
            width={200}
            height={240}
            className="book-item-img"
            style={{ borderRadius: 8 }}
          />
        </Box>
      </Grid>
      <Grid xs={12} md={6}>
        <Typography variant="h6">{data.volumeInfo.title}</Typography>
        {data.volumeInfo.subtitle && (
          <Typography variant="body2" gutterBottom>
            {data.volumeInfo.subtitle}
          </Typography>
        )}
        <Typography variant="subtitle2" noWrap>
          {data.volumeInfo.authors?.join(' - ')}
        </Typography>
        {data.volumeInfo.publisher && (
          <Typography variant="caption" noWrap gutterBottom>
            {data.volumeInfo.publisher}
          </Typography>
        )}
        <Typography
          variant="body2"
          gutterBottom
          sx={{
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 9,
          }}
        >
          {data.volumeInfo.description}
        </Typography>
      </Grid>
    </Grid>
  );
};
