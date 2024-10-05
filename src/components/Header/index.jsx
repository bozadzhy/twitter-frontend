import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Header.module.scss";
import { logout, selectIsAuth } from "../../redux/slices/auth";
import { authReducer } from "../../redux/slices/auth";
import { Link } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import TwitterIcon from '@mui/icons-material/Twitter';
// import Link from "@mui/material/Link";

// const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const Header = () => {
  const isAuth = useSelector(selectIsAuth);
  const user = useSelector((state) => state.auth.data);
  const dispatch = useDispatch();
  const onClickLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch(logout());
      window.localStorage.removeItem("token");
    }
  };
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <AppBar position="static">
      <Container>
        <Toolbar disableGutters>
          <TwitterIcon sx={{mr:"8px"}}/>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            
            }}
          >Twitter</Typography>

          <Box sx={{ flexGrow: 1, display: "flex" }}>
            <Link className={styles.logo} to="/">
              <div>Posts</div>
            </Link>
          </Box>

          {isAuth ? (
            <>
              <Box sx={{ display: { xs: "none", md: "flex" } }}>
                <Link
                  to="/add-post"
                  style={{ textDecoration: "none", marginRight: 8 }}
                >
                  <div className={styles.logo}>write an article</div>
                </Link>

                <Button
                  sx={{ marginRight: "8px" }}
                  onClick={onClickLogout}
                  variant="contained"
                  color="error"
                >
                  LOGOUT
                </Button>
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="account">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar>{user.fullName.toUpperCase().charAt(0)}</Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px", display: { xs: "flex", md: "none" } }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem
                    onClick={() => {
                      handleCloseUserMenu();
                      onClickLogout();
                    }}
                  >
                    <Button
                      sx={{ marginRight: "8px" }}
                      variant="contained"
                      color="error"
                    >
                      LOGOUT
                    </Button>
                  </MenuItem>
                  <MenuItem>
                    <Link
                      to="/add-post"
                      style={{ textDecoration: "none", marginRight: 8 }}
                    >
                      <div className={styles.logo}>write an article</div>
                    </Link>
                  </MenuItem>
                </Menu>
              </Box>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{ textDecoration: "none", marginRight: 8 }}
              >
                <div className={styles.logo}>Login</div>
              </Link>
              <Link
                to="/register"
                style={{ textDecoration: "none", marginRight: 8 }}
              >
                <div className={styles.logo}>Create profile</div>
              </Link>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
