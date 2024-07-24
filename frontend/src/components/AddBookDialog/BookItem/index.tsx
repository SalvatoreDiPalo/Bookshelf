import { Volume } from "@/models/google-volumes";
import { Box, BoxProps, styled, Typography } from "@mui/material";
import { useState } from "react";
import ConfirmDialog from "../ConfirmDialog";
import { axiosInstance } from "@/utils/axios";
import { BookDTO } from "@/models/BookDTO";
import { volumeToBookDTO } from "@/utils/helpers";

interface BookItemProps {
  isInLibrary: boolean;
  data?: Volume;
}

const BookBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  flexFlow: "row nowrap",
  "&:hover": {
    backgroundColor: theme.palette.mode == "light" ? "#F4F5F9" : "#272727",
  },
  padding: 12,
}));

export default function BookItem({ isInLibrary, data }: BookItemProps) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = async (volume?: Volume) => {
    if (!volume) {
      setOpen(false);
      return;
    }
    // TODO call api to create a book and add it to user library
    const response = await axiosInstance.post<BookDTO>(
      `/books`,
      volumeToBookDTO(volume),
    );
    const book: BookDTO = response.data;
    await axiosInstance<BookDTO>(`/library/book/${book.id}`, {
      method: "POST",
    });
    setOpen(false);
  };

  if (!data || !data.volumeInfo) return null;

  const imageLinks = data.volumeInfo.imageLinks;

  return (
    <>
      <BookBox onClick={handleClickOpen}>
        <Box className="relative mr-2 w-[46px]">
          <img
            srcSet={
              imageLinks?.smallThumbnail ??
              imageLinks?.small ??
              imageLinks?.thumbnail
            }
            src={
              imageLinks?.smallThumbnail ??
              imageLinks?.small ??
              imageLinks?.thumbnail
            }
            alt={"Book"}
            loading="lazy"
            width={46}
            height={52}
            className="book-item-img"
            style={{ borderRadius: 8 }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexFlow: "column nowrap",
            overflow: "hidden",
          }}
        >
          <Typography
            variant="subtitle2"
            noWrap
            sx={{
              textOverflow: "ellipsis",
            }}
          >
            {data.volumeInfo.title}
          </Typography>
          {data.volumeInfo.authors && (
            <Typography variant="caption" noWrap>
              {data.volumeInfo.authors.join(" - ")}
            </Typography>
          )}
        </Box>
      </BookBox>
      {open && (
        <ConfirmDialog
          open={open}
          handleClose={handleClose}
          data={data}
          isInLibrary={isInLibrary}
        />
      )}
    </>
  );
}
