import React from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/router";
import { useRouterPush } from "@/hooks/useRouterPush";

export default function ButtonsMobileAppBar({ ...props }) {
  const routerPush = useRouterPush();

  const { handleOpenNavMenu, anchorElNav, handleCloseNavMenu, pages } = props;
  const router = useRouter();

  const handleNavigation = (path: string) => {
    routerPush(path);
    handleCloseNavMenu();
  };

  return (
    <Box sx={{ display: { xs: "flex", sm: "none" } }}>
      <IconButton
        size="medium"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpenNavMenu}
        color="inherit"
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
      >
        {pages.length > 0 &&
          pages.map((page: any) => (
            <MenuItem key={page.title}>
              <ListItemIcon>{page.icon}</ListItemIcon>
              <ListItemText
                primary={page.title}
                onClick={() => {
                  if (page.subpages.length === 0) {
                    handleNavigation(page.url || "/");
                  }
                }}
              />
            </MenuItem>
          ))}
      </Menu>
    </Box>
  );
}
