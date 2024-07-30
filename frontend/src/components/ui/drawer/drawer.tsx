import { useLogto } from '@logto/react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import BookIcon from '@mui/icons-material/Book';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/app/main-provider';
import { baseUrl } from '@/utils/const';

import AddBookDialog from '../dialog/add-book-dialog';

const drawerWidth = 240;

interface MenuDrawerProps {
  open: boolean;
  handleDrawer: () => void;
}

interface DrawerRoute {
  label: string;
  url: string;
  Icon: JSX.Element;
}

const drawerRoutes: DrawerRoute[] = [
  {
    label: 'My Books',
    url: '/home',
    Icon: <BookIcon />,
  },
  {
    label: 'Profile',
    url: '/home/profile',
    Icon: <AccountCircleIcon />,
  },
  {
    label: 'Settings',
    url: '/home/Settings',
    Icon: <SettingsIcon />,
  },
];

export default function MenuDrawer({ open, handleDrawer }: MenuDrawerProps) {
  const { signOut } = useLogto();
  const navigate = useNavigate();
  const theme = useTheme();
  const { shouldReload } = useAuth();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [randomId, setRandomId] = useState<number>(Date.now());

  const handleClickOpen = () => {
    setOpenDialog(true);
    handleDrawer();
  };

  const handleClose = () => {
    setRandomId(Date.now());
    setOpenDialog(false);
    shouldReload!();
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: 72,
          height: 'calc(100% - 72px)',
          borderTopRightRadius: 8,
          boxShadow: 2,
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <List>
        {drawerRoutes.map((route) => (
          <ListItem key={route.label} disablePadding>
            <ListItemButton onClick={() => navigate(route.url)}>
              <ListItemIcon>{route.Icon}</ListItemIcon>
              <ListItemText primary={route.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <ListItem>
        <ListItemButton
          sx={{
            backgroundColor: theme.palette.primary.main,
            borderRadius: 8,
            height: '90%',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#758afe',
            },
          }}
          onClick={handleClickOpen}
        >
          <ListItemIcon>
            <AddIcon sx={{ color: '#fff' }} />
          </ListItemIcon>
          <ListItemText primary="Add a Book" />
        </ListItemButton>
      </ListItem>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              void signOut(baseUrl);
            }}
          >
            <ListItemText primary="Log out" />
          </ListItemButton>
        </ListItem>
      </List>
      {openDialog && (
        <AddBookDialog
          key={randomId}
          open={openDialog}
          handleClose={handleClose}
        />
      )}
    </Drawer>
  );
}
