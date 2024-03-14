import React from "react";
// import './dashboardnav.css'
import { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Avatar from "@mui/material/Avatar";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { Container, Menu, MenuItem } from "@mui/material";
import Paper from "@mui/material/Paper";
import { blue, green, lightGreen, purple } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setdata } from "../store/store";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));
export default function Dashboardnav() {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openn = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function handlelogout() {
    handleClose();
    localStorage.removeItem("user");
    localStorage.removeItem("isloggedin");
    localStorage.removeItem("otp");
    localStorage.removeItem("regotp");
    localStorage.removeItem("latestdata");
    localStorage.removeItem("latestincome");
    localStorage.removeItem("latestexpense");
    localStorage.removeItem("dashboardchart");
    localStorage.removeItem("chartdata");
    localStorage.removeItem("chartinfo");
    localStorage.removeItem("chartincome");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  }

  function handleanotheraccount() {
    handlelogout();
    dispatch(setdata({ form: "ragistration" }));
  }
  return (
    <Box Container>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{ backgroundColor: purple[600] }}
      >
        <Toolbar>
          <IconButton
            color="black"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color="black"
            size="large"
            sx={{ ml: open ? 150 : 175 }}
            aria-controls={openn ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openn ? "true" : undefined}
            onClick={handleClick}
          >
            <Avatar
              sx={{ width: 32, height: 32, backgroundColor: purple[300] }}
            >
              {JSON.parse(
                localStorage.getItem("user")
              )[0].userName[0].toUpperCase()}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={openn}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar />
          Edit Profile
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleanotheraccount();
          }}
        >
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Change password
        </MenuItem>
        <MenuItem
          onClick={() => {
            handlelogout();
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <List>
          {[
            { text: "My Profile", url: "../dashboard" },
            { text: "My Expense", url: "../expense" },
            { text: "Expense Report", url: "../expensereport" },
            { text: "Expense Category", url: "../expensecategory" },
            { text: "Income", url: "../income" },
            { text: "Calender View", url: "../calender" },
          ].map((t, index) => (
            <ListItem
              key={t.text}
              disablePadding
              onClick={() => {
                navigate(t.url, { replace: true });
              }}
            >
              <ListItemButton>
                <ListItemIcon>
                  {index === 0 && (
                    <AccountCircleRoundedIcon></AccountCircleRoundedIcon>
                  )}
                  {index === 1 && (
                    <AccountBalanceRoundedIcon></AccountBalanceRoundedIcon>
                  )}
                  {index === 2 && (
                    <AssessmentRoundedIcon></AssessmentRoundedIcon>
                  )}
                  {index === 3 && <CategoryRoundedIcon></CategoryRoundedIcon>}
                  {index === 4 && <PaidRoundedIcon></PaidRoundedIcon>}
                  {index === 5 && (
                    <CalendarMonthRoundedIcon></CalendarMonthRoundedIcon>
                  )}
                </ListItemIcon>
                <ListItemText primary={t.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
      </Main>
    </Box>
  );
}
