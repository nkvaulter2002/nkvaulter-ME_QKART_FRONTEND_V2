import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const username = localStorage.getItem("username");
  const histroy = useHistory();
  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children}
      {hasHiddenAuthButtons ? (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => histroy.push("/")}
        >
          Back to explore
        </Button>
      ) : (
        <Stack direction="row" alignItems={"center"} spacing={1}>
          {username ? (
            <>
              <Avatar src="avatar.png" alt={username} />

              <p>{username}</p>
              <Button
                onClick={() => {
                  localStorage.clear();
                  histroy.push("/");
                  window.location.reload();
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => histroy.push("/login")}>Login</Button>
              <Button
                onClick={() => histroy.push("/register")}
                variant={"contained"}
              >
                Register
              </Button>
            </>
          )}
        </Stack>
      )}
    </Box>
  );
};

export default Header;
