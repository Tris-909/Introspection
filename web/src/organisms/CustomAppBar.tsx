import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Box,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import QueueIcon from "@mui/icons-material/Queue";
import AddIcon from "@mui/icons-material/Add";
import { sharedColor } from "consts";
import { signOut } from "firebase/auth";
import { auth } from "databases/firebase";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "contexts";
import { RecordMistakeDialog, ManageCategoriesDialog } from "molecules";

const CustomAppBar = () => {
  const { updateIsOpenRecordMistakeForm, updateIsOpenManageCategoriesDialog } =
    useAppStore();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logOutHandler = async () => {
    signOut(auth);
    navigate("/authenticate");
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{ backgroundColor: sharedColor.appBar.primary }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box display={"flex"} flexDirection={"row"}>
            <Tooltip title="Manage Categories">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 3, display: "flex", alignItems: "center" }}
                onClick={() => {
                  updateIsOpenManageCategoriesDialog(true);
                }}
              >
                <QueueIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Record a mistake">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2, display: "flex", alignItems: "center" }}
                onClick={() => {
                  updateIsOpenRecordMistakeForm(true);
                }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Box>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => logOutHandler()}>Log Out</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <RecordMistakeDialog />
      <ManageCategoriesDialog />
    </>
  );
};

export default CustomAppBar;
