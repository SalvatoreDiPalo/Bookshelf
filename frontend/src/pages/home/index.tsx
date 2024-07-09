import { UserInfoResponse, useLogto } from "@logto/react";
import { useEffect, useState } from "react";
import {
  Box,
  Tab,
  TabClasses,
  TabProps,
  Tabs,
  TabsProps,
  Theme,
  styled,
  tabClasses,
  useTheme,
} from "@mui/material";

export const tabsStyles = () => ({
  root: {
    backgroundColor: "#eee",
    borderRadius: "10px",
    minHeight: 44,
  },
  flexContainer: {
    position: "relative",
    padding: "0 3px",
    zIndex: 1,
  },
  indicator: {
    top: 3,
    bottom: 3,
    right: 3,
    height: "auto",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 12px 0 rgba(0,0,0,0.16)",
  },
});

export const tabItemStyles = (theme: Theme) => ({
  root: {
    fontWeight: 500,
    minHeight: 44,
    minWidth: 96,
    opacity: 0.7,
    color: theme.palette.text.primary,
    textTransform: "initial",
    "&:hover": {
      opacity: 1,
    },
    [`&.${tabClasses.selected}`]: {
      color: theme.palette.text.primary,
      opacity: 1,
    },
    [theme.breakpoints.up("md")]: {
      minWidth: 120,
    },
  },
});

const StyledTabs = styled(Tabs)<TabsProps>(({ theme }) => ({
  overflow: "hidden",
  display: "flex",
  backgroundColor: "grey", // TODO change this one rgb(238, 238, 238);
  borderRadius: 10,
  minHeight: 44,
  "& .MuiTabs-flexContainer": {
    position: "relative",
    zIndex: 1,
    paddingVertical: 0,
    paddingHorizontal: 3,
  },
}));

export default function Home() {
  const { isAuthenticated, signIn, signOut, fetchUserInfo, getAccessToken } =
    useLogto();
  const [user, setUser] = useState<UserInfoResponse>();
  const [accessToken, setAccessToken] = useState("ciao");
  const [value, setValue] = useState<number>(0);
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        const userInfo = await fetchUserInfo();
        const token = await getAccessToken("http://localhost:3001");
        setAccessToken(token ?? "");
        console.log("Token", token);
        setUser(userInfo);
      }
    })();
  }, [fetchUserInfo, getAccessToken, isAuthenticated]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ maxWidth: { xs: 320, sm: 480 }, bgcolor: "background.paper" }}>
      <StyledTabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
        TabIndicatorProps={{
          sx: {
            top: 3,
            bottom: 3,
            right: 3,
            height: "auto",
            borderRadius: 2,
            backgroundColor: "rgb(255, 255, 255)",
          },
        }}
      >
        <Tab disableRipple label="Item One" />
        <Tab disableRipple label="Item Two" />
        <Tab disableRipple label="Item Three" />
        <Tab disableRipple label="Item Four" />
        <Tab disableRipple label="Item Five" />
        <Tab disableRipple label="Item Six" />
        <Tab disableRipple label="Item Seven" />
      </StyledTabs>
    </Box>
  );
}
