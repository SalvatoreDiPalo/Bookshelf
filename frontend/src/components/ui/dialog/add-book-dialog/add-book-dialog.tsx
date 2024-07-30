import {
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  LinearProgress,
  styled,
} from '@mui/material';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { useState } from 'react';

import { GoogleIdentifier } from '@/models/enum/google-identifier';
import { GoogleList } from '@/models/google-list';
import { Volume } from '@/models/google-volumes';
import { axiosInstance } from '@/utils/axios';
import { env } from '@/utils/env';

import AddBookEntry from './add-book-entry';

interface AddBookDialogProps {
  open: boolean;
  handleClose: () => void;
}

const TransparentDialog = styled(Dialog)<DialogProps>(() => ({
  '.MuiDialog-container > .MuiPaper-root': {
    backgroundColor: 'transparent',
    backgroundImage: 'unset',
  },
  '.MuiDialogContent-root': {
    overflowY: 'hidden',
    padding: 0,
  },
}));

export const AddBookDialog = ({ open, handleClose }: AddBookDialogProps) => {
  const [text, setText] = useState<string>('');
  const [items, setItems] = useState<Volume[]>([]);
  const [booksAlreadyPresent, setBooksAlreadyPresent] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    if (!text.length) {
      // TODO handle error
      return;
    }
    setLoading(true);

    try {
      const response = await axios.get<GoogleList<Volume>>(
        `${env.GOOGLE_BOOKS_API}/volumes`,
        {
          params: {
            q: text,
            maxResults: env.GOOGLE_BOOKS_ITEMS_PER_PAGE,
            startIndex: 0,
            printType: 'books',
          },
        },
      );
      const books = response.data.items.filter(
        (volume) =>
          volume.volumeInfo.industryIdentifiers &&
          volume.volumeInfo.industryIdentifiers.some(
            (identifier) => identifier.type === GoogleIdentifier.ISBN_13,
          ),
      );
      setItems(books);

      const checkBooksResponse = await axiosInstance.post<string[]>(
        `/library/check`,
        books.map((book) => book.id),
      );
      setBooksAlreadyPresent(checkBooksResponse.data);
    } catch (err) {
      console.error('Errore while loading data', err);
    } finally {
      setLoading(false);
    }
  };

  const addIdToBookAlreadyPresent = (id: string) => {
    setBooksAlreadyPresent([...booksAlreadyPresent, id]);
  };

  return (
    <TransparentDialog
      open={open}
      onClose={handleClose}
      disableRestoreFocus
      className="bg-transparent"
    >
      <DialogContent>
        <Paper
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            loadData();
          }}
          sx={{
            p: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <InputBase
            sx={{ flex: 1 }}
            placeholder="Search books"
            inputProps={{ 'aria-label': 'search books' }}
            fullWidth
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setText(event.target.value)
            }
            autoFocus
          />

          <Button variant="contained" onClick={() => loadData()}>
            Search
          </Button>
        </Paper>
        {loading && <LinearProgress />}
        <Paper
          sx={{
            height: 500,
            overflowY: 'auto',
            overflowX: 'hidden',
            marginTop: 1,
            p: '16px',
            flexFlow: 'column nowrap',
            minHeight: 400,
            width: '100%',
            display: items.length ? 'flex' : 'none',
          }}
        >
          {!loading &&
            items.map((book) => (
              <AddBookEntry
                key={book.id}
                data={book}
                isInLibrary={booksAlreadyPresent.includes(book.id)}
                addIdToBookAlreadyPresent={addIdToBookAlreadyPresent}
              />
            ))}
        </Paper>
      </DialogContent>
    </TransparentDialog>
  );
};