import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  Input,
  LinearProgress,
  Typography,
  useFormControl,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMemo, useState } from "react";
import * as ISBN from "isbn3";
import { axiosInstance } from "@/utils/axios";
import { BASE_URL } from "@/utils/const";
import { BookDTO } from "@/models/BookDTO";
import Grid from "@mui/material/Unstable_Grid2";

interface AddBookDialogProps {
  open: boolean;
  handleClose: () => void;
}

interface FormHelperProps {
  isValueValid: boolean;
}

function MyFormHelperText({ isValueValid }: FormHelperProps) {
  const { filled, focused } = useFormControl() || {};

  const errorText = useMemo(() => {
    console.log("filled && !focused", filled && !focused);
    if (filled && !focused) {
      // Do isbn validation
      return !isValueValid ? "ISBN not valid!" : "";
    }

    return "";
  }, [filled, focused]);

  return <FormHelperText error>{errorText}</FormHelperText>;
}

export default function AddBookDialog({
  open,
  handleClose,
}: AddBookDialogProps) {
  const [isbn, setIsbn] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<BookDTO>();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const fetchBook = async () => {
    setIsLoading(true);
    const response = await axiosInstance<BookDTO>(
      `${BASE_URL}/api/books/${isbn}`,
    );
    setData(response.data);
    setIsLoading(false);
  };

  return (
    <Dialog
      open={open}
      fullScreen={fullScreen}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const email = formJson.email;
          console.log(email);
          handleClose();
        },
      }}
    >
      {isLoading && <LinearProgress />}
      <DialogTitle>Add Book</DialogTitle>
      <DialogContent>
        <DialogContentText>Add a book by searching by ISBN:</DialogContentText>

        <FormControl sx={{ width: "25ch" }}>
          <Input
            required
            margin="dense"
            id="isbn"
            name="isbn"
            type="text"
            value={isbn}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setIsbn(event.target.value);
              const parsedIsbn: ISBN | null = ISBN.parse(event.target.value);
              setIsValid((parsedIsbn && parsedIsbn.isValid) ?? false);
            }}
            fullWidth
          />
          <MyFormHelperText isValueValid={isValid} />
        </FormControl>

        {data && (
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
                <Typography variant="subtitle1" gutterBottom>
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
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={fetchBook} disabled={!isValid}>
          Search
        </Button>
      </DialogActions>
    </Dialog>
  );
}
