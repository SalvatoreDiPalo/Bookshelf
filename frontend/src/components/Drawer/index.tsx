import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import AddIcon from "@mui/icons-material/Add";
import { useLogto } from "@logto/react";
import { baseUrl, redirectUrl } from "@/utils/const";

const drawerWidth = 240;

interface MenuDrawerProps {
  open: boolean;
}

export default function MenuDrawer({ open }: MenuDrawerProps) {
  const { isAuthenticated, signIn, signOut } = useLogto();
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
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
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
        {!isAuthenticated ? (
          <>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  void signIn(redirectUrl);
                }}
              >
                <ListItemText primary="Log in" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  void signIn({
                    redirectUri: redirectUrl,
                    interactionMode: "signUp",
                  });
                }}
              >
                <ListItemText primary="Sign in" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                void signOut(baseUrl);
              }}
            >
              <ListItemText primary="Log out" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Drawer>
  );
}
