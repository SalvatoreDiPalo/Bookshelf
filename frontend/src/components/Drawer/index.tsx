import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
} from "@mui/material";
import { useLogto } from "@logto/react";
import { baseUrl } from "@/utils/const";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import BookIcon from "@mui/icons-material/Book";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";

const drawerWidth = 240;

interface MenuDrawerProps {
  open: boolean;
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

export default function MenuDrawer({ open }: MenuDrawerProps) {
  const { signOut } = useLogto();
  const navigate = useNavigate();
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
          backgroundColor: "#F4F5F9",
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
          onClick={() => {
            //TODO add service to add a book
          }}
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
    </Drawer>
  );
}
