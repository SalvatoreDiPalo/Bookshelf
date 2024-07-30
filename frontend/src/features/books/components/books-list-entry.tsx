import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Box, IconButton, Tooltip, Typography, styled } from '@mui/material';
import { useState } from 'react';

import BookListMenu from '@/components/ui/menu/book-list-menu';
import { BookProps } from '@/types/props/book-props';
import { shouldForwardProp } from '@/utils/helpers';

export default function BookListEntry({
  item,
  states,
  isSingleLine,
  updateElement,
  removeElement,
}: BookProps) {
  const authors = item.authors.map((author) => author.name).join(' & ');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <BookBox isSingleLine={isSingleLine ?? false}>
      <Box className="relative max-h-[164px]">
        <Image
          srcSet={`https://loremflickr.com/240/280/book`}
          src={`https://loremflickr.com/240/280/book`}
          alt={`Book image of ${item.title}`}
          loading="lazy"
          isSingleLine={isSingleLine ?? false}
        />
        {!isSingleLine && (
          <IconButton
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            className="absolute right-0 top-0"
          >
            <MoreHorizIcon />
          </IconButton>
        )}
      </Box>

      <TextBox isSingleLine={isSingleLine ?? false}>
        <Tooltip title={item.title}>
          <Typography variant="subtitle2" noWrap>
            {item.title}
          </Typography>
        </Tooltip>
        <Tooltip title={authors}>
          <Typography variant="caption" noWrap>
            By {authors && authors.length ? authors : 'N/A'}
          </Typography>
        </Tooltip>

        {isSingleLine && (
          <IconButton
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            className="absolute right-0"
          >
            <MoreHorizIcon />
          </IconButton>
        )}
      </TextBox>

      <BookListMenu
        item={item}
        anchorEl={anchorEl}
        handleClose={handleClose}
        open={open}
        states={states}
        updateElement={updateElement}
        removeElement={removeElement}
      />
    </BookBox>
  );
}

export interface StyleProps {
  isSingleLine: boolean;
}

const BookBox = styled(Box, {
  shouldForwardProp,
})<StyleProps>(({ theme, isSingleLine }) => ({
  maxHeight: 250,
  width: '100%',
  maxWidth: isSingleLine ? 'none' : 164,
  cursor: 'pointer',
  ...(isSingleLine && {
    display: 'flex',
    flexFlow: 'row',
    marginRight: 2,

    ':hover': {
      backgroundColor: theme.palette.primary.secondBackground,
      borderRadius: 8,
    },
  }),
}));

const TextBox = styled(Box, { shouldForwardProp })<StyleProps>(
  ({ isSingleLine }) => ({
    ...(isSingleLine && {
      marginLeft: 8,
      flex: 1,
      alignContent: 'center',
      paddingBottom: 8,
      overflowX: 'hidden',
      paddingRight: 42,
    }),
    position: 'relative',
    display: 'flex',
    flexFlow: 'column',
    alignSelf: 'center',
  }),
);

const Image = styled('img', { shouldForwardProp })<StyleProps>(
  ({ theme, isSingleLine }) => ({
    ...(!isSingleLine
      ? {
          height: '100%',
          width: '100%',
          boxShadow: theme.shadows[1],
        }
      : {
          maxHeight: 164,
          maxWidth: 86,
          verticalAlign: 'middle',
          boxShadow: theme.shadows[5],
        }),
    ':hover': { transform: 'scale(1.02)' },
    borderRadius: 8,
    aspectRatio: '1 / 1',
  }),
);
