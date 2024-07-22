import { Volume } from "@/models/google-volumes";
import { Box, BoxProps, styled, Typography } from "@mui/material";
import { useState } from "react";
import ConfirmDialog from "../ConfirmDialog";

interface BookItemProps {
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

export default function BookItem({ data }: BookItemProps) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (volume?: Volume) => {
    setOpen(false);
    // TODO call api to create a book and add it to user library
  };

  if (!data || !data.volumeInfo) return null;

  return (
    <>
      <BookBox onClick={handleClickOpen}>
        <Box className="relative mr-2 w-[46px]">
          <img
            srcSet={data.volumeInfo.imageLinks.smallThumbnail}
            src={data.volumeInfo.imageLinks.smallThumbnail}
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
        <ConfirmDialog open={open} handleClose={handleClose} data={data} />
      )}
    </>
  );
}
