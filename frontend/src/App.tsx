import { Box, CssBaseline, styled } from "@mui/material";
import { Fragment, useState } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import useDebugRender from "tilg";
import MenuAppBar from "./components/AppBar";
import MenuDrawer from "./components/Drawer";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  overflowX: "auto",
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginTop: 48,
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

export default function App() {
  useDebugRender();
  const [open, setOpen] = useState<boolean>(false);

  const handleDrawer = () => {
    setOpen((prevCheck) => !prevCheck);
  };

  return (
    <Fragment>
      <Box sx={{ display: "flex", overflowX: "hidden" }}>
        <CssBaseline />
        <MenuAppBar open={open} handleDrawer={handleDrawer} />
        <MenuDrawer open={open} handleDrawer={handleDrawer} />
        <Main open={open}>
          <Outlet />
          <ScrollRestoration />
        </Main>
      </Box>
    </Fragment>
  );
}
