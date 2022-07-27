import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useHistory } from "react-router-dom";
import LogIn from "./LogIn";
import { fetchUserGet } from "../redux/actions/fetchUserGet";
import { useDispatch, useSelector } from "react-redux";

const SearchBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [anchorElLogIn, setAnchorElLogIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const history = useHistory();
  const dispatch = useDispatch();
  const { getUserReducer } = useSelector((state) => ({ getUserReducer: state }));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (path) => {
    if (path == "/admin") {
      if (isAuthenticated) history.push(path);
      else window.alert("Please LogIn first!");
    } else {
      history.push(path);
    }
    setAnchorEl(null);
  };

  useEffect(() => {
    console.log(isAuthenticated);
  }, [isAuthenticated]);

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton onClick={handleClick} size="large" edge="start" color="inherit" aria-controls={open ? "basic-menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined} aria-label="menu" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              News
            </Typography>
            {isAuthenticated ? (
              <Button color="inherit" onClick={() => setIsAuthenticated(false)}>
                Logout
              </Button>
            ) : (
              <Button color="inherit" onClick={() => setAnchorElLogIn(!anchorElLogIn)}>
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={() => handleClose("/admin")}>Admin</MenuItem>
          <MenuItem onClick={() => handleClose("/home")}>Home</MenuItem>
          <MenuItem onClick={() => handleClose("/stats")}>Stats</MenuItem>
        </Menu>
      </Box>

      {anchorElLogIn ? <LogIn auncorPop={anchorElLogIn} setIsAuthenticated={setIsAuthenticated} /> : null}
    </div>
  );
};

export default SearchBar;
