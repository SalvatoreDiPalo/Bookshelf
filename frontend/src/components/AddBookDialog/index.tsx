import {
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
  useFormControl,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMemo, useState } from "react";
import * as ISBN from "isbn3";
import { axiosInstance } from "@/utils/axios";
import { BASE_URL } from "@/utils/const";
import { BookDTO } from "@/models/BookDTO";
import BookInformation from "./BookInformation";
import { ExistsDTO } from "@/models/ExistsDTO";
import { useAppContext } from "@/context/AppProvider";

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
  const theme = useTheme();
  const { updateLoading } = useAppContext();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isbn, setIsbn] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<BookDTO>();
  const [existsBook, setExistsBook] = useState<boolean>(true);

  const fetchBook = async () => {
    setIsLoading(true);
    const response = await axiosInstance<BookDTO>(
      `${BASE_URL}/api/books/${isbn}`,
    );
    setData(response.data);
    await checkBook();
    setIsLoading(false);
  };

  const checkBook = async () => {
    const response = await axiosInstance<ExistsDTO>(
      `${BASE_URL}/api/books/${isbn}/check-shelf`,
    );
    setExistsBook(response.data.exists);
  };

  const addBookToPersonalShelf = async () => {
    updateLoading!();
    const response = await axiosInstance<ExistsDTO>(
      `${BASE_URL}/api/books/${isbn}`,
      { method: "POST" },
    );
    updateLoading!();
    console.log("Response", response);
    handleClose();
  };

  return (
    <Dialog open={open} fullScreen={fullScreen} onClose={handleClose}>
      {isLoading && <LinearProgress />}
      <DialogTitle>Add Book</DialogTitle>
      <DialogContent>
        <DialogContentText>Add a book by searching by ISBN:</DialogContentText>

        <FormControl className="mb-2 w-[25ch]">
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

        <BookInformation data={data} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        {!existsBook && (
          <Button onClick={addBookToPersonalShelf}>Add to Collection</Button>
        )}
        <Button onClick={fetchBook} disabled={!isValid}>
          Search
        </Button>
      </DialogActions>
    </Dialog>
  );
}
