import React from "react";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  Menu,
  MenuItem,
  Button,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link} from "react-router-dom";
import { useDispatch } from "react-redux";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { purple } from "@mui/material/colors";
import Content from "./content";

export default function Home() {

  const pages = ["Home", "Features"];
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <Box container sx={{backgroundColor:'pink'}}>
      <Box container>  
        <AppBar
        position="fixed"
        sx={{ backgroundColor: purple[600], color: "black" }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 10,
                p: 1,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: "bold",
                letterSpacing: ".3rem",
                textDecoration: "none",
                color: "white",
                backgroundColor: purple[600],
              }}
            >
              ExpenseForge
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <MonetizationOnIcon
              sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
            />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",

                textDecoration: "none",
              }}
            >
              ExpenseForge
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: "black",
                    display: "block",
                    fontWeight: "bold",
                    fontSize: 15,
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
            <Link to='/login' sx={{textDecoration:'none'}}> <Button
                sx={{ color: "black", m: 1, backgroundColor: "white",fontWeight:'bold' }}
                variant="outlined"
                 
                  color="secondary"
                onClick={() => {
                  localStorage.setItem('form',JSON.stringify(1))
                }}
             
              >
               Sign In
              </Button>
              </Link>
            </Box>
          </Toolbar>
        </Container>
      </AppBar></Box>
      <Box container >  <Content /></Box>    
       
    
    </Box>
  );
}
