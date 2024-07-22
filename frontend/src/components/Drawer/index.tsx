import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  useTheme,
} from "@mui/material";
import { useLogto } from "@logto/react";
import { baseUrl } from "@/utils/const";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import BookIcon from "@mui/icons-material/Book";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";
import AddBookDialog from "../AddBookDialog";

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
    label: "My Books",
    url: "/home",
    Icon: <BookIcon />,
  },
  {
    label: "Profile",
    url: "/home/profile",
    Icon: <AccountCircleIcon />,
  },
  {
    label: "Settings",
    url: "/home/Settings",
    Icon: <SettingsIcon />,
  },
];

export default function MenuDrawer({ open, handleDrawer }: MenuDrawerProps) {
  const { signOut } = useLogto();
  const navigate = useNavigate();
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [randomId, setRandomId] = useState<number>(Date.now());

  const handleClickOpen = () => {
    setOpenDialog(true);
    handleDrawer();
  };

  const handleClose = () => {
    setRandomId(Date.now());
    setOpenDialog(false);
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          top: 72,
          borderRadius: 2,
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
      <ListItem disablePadding>
        <ListItemButton
          sx={{
            backgroundColor: theme.palette.primary.main,
          }}
          onClick={handleClickOpen}
        >
          <ListItemIcon>
            <AddIcon />
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
