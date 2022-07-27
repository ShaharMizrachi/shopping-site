import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Popper from "@mui/material/Popper";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserGet } from "../redux/actions/fetchUserGet";
import TextField from "@mui/material/TextField";

const LogIn = (props) => {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState({ user: "", password: "" });
  const dispatch = useDispatch();
  const { getUserReducer } = useSelector((state) => ({ getUserReducer: state }));

  //pop-up field
  const [anchorEl, setAnchorEl] = useState(props.auncorPop);
  // const handleClick = (event) => {
  //   setAnchorEl(anchorEl ? null : event.currentTarget);
  // };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  // In case clicking in the background for closing popUp window
  const popUp = useRef(null);

  useEffect(() => {
    const listner = (event) => {
      if (popUp.current && !popUp.current.contains(event.target)) {
        setAnchorEl(null);
      }
    };

    document.addEventListener("mousedown", listner);

    return () => document.removeEventListener("mousedown", listner);
  }, []);

  const authentication = (e) => {
    console.log(userDetails);
    e.preventDefault();
    dispatch(fetchUserGet(userDetails.user, userDetails.password));
    if (getUserReducer.getUserReducer != null) {
      if (getUserReducer.getUserReducer.data) {
        props.setIsAuthenticated(true);
        setAnchorEl(false);
        window.alert("Login was successful you have access to Admin page");
      }
    } else {
      window.alert("Please supply courrect user and password to login Admin Page");
      props.setIsAuthenticated(false);
    }
  };

  const popup = () => {
    // my pop-up of shooping cart
    return (
      <div>
        <Popper placement={"right"} id={id} open={open} anchorEl={anchorEl} transition>
          <div id="popUp" ref={popUp}>
            <Box sx={{ border: 5, p: 1, bgcolor: "white", width: 450, height: 250, borderColor: "#0d6efd", borderRadius: 2, marginLeft: 5 }}>
              <Typography align="center" variant="h4" color="#0d6efd">
                LogIn
              </Typography>
              <div className="col-9 offset-2 mt-1 mb-1" style={{ display: "inline-flex" }}>
                <form onSubmit={authentication}>
                  <div className="row  col-12" style={{ marginLeft: 0 }}>
                    <TextField onChange={(e) => setUserDetails({ ...userDetails, user: e.target.value })} required id="filled-required" label="User" value={userDetails.user} variant="filled" style={{ marginTop: 5 }} />
                    <TextField onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })} required id="filled-required" label="Password" value={userDetails.password} variant="filled" style={{ marginTop: 5 }} />
                    <Button variant="contained" type="submit" style={{ marginTop: 5 }}>
                      submit
                    </Button>
                  </div>
                </form>
              </div>
            </Box>
          </div>
        </Popper>
      </div>
    );
  };

  return <div>{popup()}</div>;
};

export default LogIn;
