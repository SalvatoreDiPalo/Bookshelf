import {
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  LinearProgress,
  styled,
} from "@mui/material";
import { useState } from "react";
import BookItem from "./BookItem";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import { GoogleList } from "@/models/google-list";
import { Volume } from "@/models/google-volumes";
import { GOOGLE_BOOKS_API, GOOGLE_BOOKS_ITEMS_PER_PAGE } from "@/utils/const";
import axios from "axios";

interface AddBookDialogProps {
  open: boolean;
  handleClose: () => void;
}

const TransparentDialog = styled(Dialog)<DialogProps>(({ theme }) => ({
  ".MuiDialog-container > .MuiPaper-root": {
    backgroundColor: "transparent",
    backgroundImage: "unset",
  },
  ".MuiDialogContent-root": {
    overflowY: "hidden",
    padding: 0,
  },
}));

export default function AddBookDialog({
  open,
  handleClose,
}: AddBookDialogProps) {
  const [text, setText] = useState<string>("");
  const [items, setItems] = useState<Volume[]>([]);
  const [loading, setLoading] = useState(false);

  const loadImages = async () => {
    if (!text.length) {
      // TODO handle error
      return;
    }
    setLoading(true);
    const response = await axios
      .get<GoogleList<Volume>>(`${GOOGLE_BOOKS_API}/volumes`, {
        params: {
          q: text,
          maxResults: GOOGLE_BOOKS_ITEMS_PER_PAGE,
          startIndex: 0,
        },
      })
      .finally(() => setLoading(false));
    setItems(response.data.items);
  };

  return (
    <TransparentDialog
      open={open}
      onClose={handleClose}
      className="bg-transparent"
    >
      <DialogContent>
        <Paper
          component="form"
          sx={{
            p: "8px 16px",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <InputBase
            sx={{ flex: 1 }}
            placeholder="Search books"
            inputProps={{ "aria-label": "search books" }}
            fullWidth
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setText(event.target.value)
            }
          />

          <Button variant="contained" onClick={() => loadImages()}>
            Search
          </Button>
        </Paper>
        {loading && <LinearProgress />}
        <Paper
          sx={{
            height: 500,
            overflowY: "auto",
            overflowX: "hidden",
            marginTop: 1,
            p: "16px",
            flexFlow: "column nowrap",
            minHeight: 400,
            width: "100%",
            display: items.length ? "flex" : "none",
          }}
        >
          {items.map((book) => (
            <BookItem key={book.id} data={book} />
          ))}
        </Paper>
      </DialogContent>
    </TransparentDialog>
  );
}
