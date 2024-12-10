"use client";

import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Box, Divider, useTheme, useMediaQuery } from "@mui/material";

import { ChecklistLarge } from "@/components/shared/Icons";
import { ArticleLarge } from "@/components/shared/Icons";
import { PersonLarge } from "@/components/shared/Icons";
import { EmailLarge } from "@/components/shared/Icons";
import { AutoGraphLarge } from "@/components/shared/Icons";
import ButtonsMobileAppBar from "@/components/AppBar/ButtonsMobileAppBar";
import ButtonsDestokAppBar from "@/components/AppBar/ButtonsDestokAppBar";
import NotificationAppBar from "@/components/AppBar/NoticationAppBar";
import UserProfileAppBar from "@/components/AppBar/UserProfileAppBar";
import { useRouter } from "next/router";
import PendingTasksAppBar from "./PendingTasksAppBar";
import { useRouterPush } from "@/hooks/useRouterPush";



export interface PageMenu {
  title: string;
  icon: React.JSX.Element;
  subpages: string[];
}

const pages = [
  {
    title: "Contratistas",
    hoverTitle: "Contratistas",
    icon: <ChecklistLarge />,
    subpages: [
      {
        nombre: "Contratos",
        url: "/microContratos/contratos",
      },
      {
        nombre: "Contratistas",
        url: "/microContratos/contratistas",
      },
      {
        nombre: "Póliza de seguro",
        url: "/microContratos/polizaSeguro",
      },
    ],
  },  
  {
    title:"Recursos",
    icon: <PersonLarge />,
    subpages: [],
  },

  {
    title: "Reportes",
    icon: <AutoGraphLarge />,
    subpages: [],
  },
  {
    title: "Comunicaciones",
    icon: <EmailLarge />,
    subpages: [],
  },
];

export default function AppBarYPF() {
  const theme = useTheme();
  const isSmallUp = useMediaQuery(theme.breakpoints.up("sm"));
  const routerPush = useRouterPush();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const [anchorElNotificacion, setAnchorElNotificacion] = useState(null);
  const [openNotificacion, setOpenNotificacion] = useState(false);

  const [anchorElUsuario, setAnchorElUsuario] = useState(null);
  const [openUsuario, setOpenUsuario] = useState(false);

  const [anchorElChecklist, setAnchorElChecklist] = useState(null);
  const [openChecklist, setOpenChecklist] = useState(false);

  const handleClickNotificacion = (event: any) => {
    setAnchorElNotificacion(anchorElNotificacion ? null : event.currentTarget);
    setOpenNotificacion(!openNotificacion);

    setOpenUsuario(false);
    setAnchorElUsuario(null);
  };

  const handleCloseNotificacion = () => {
    setAnchorElNotificacion(null);
    setOpenNotificacion(false);
  };

  const handleClickUsuario = (event: any) => {
    setAnchorElUsuario(anchorElUsuario ? null : event.currentTarget);
    setOpenUsuario(!openUsuario);

    setOpenNotificacion(false);
    setAnchorElNotificacion(null);
  };

  const handleCloseUsuario = () => {
    setAnchorElUsuario(null);
    setOpenUsuario(false);
  };

  const handleClickChecklist = (event: any) => {
    setAnchorElChecklist(anchorElChecklist ? null : event.currentTarget);
    setOpenChecklist(!openChecklist);
  
    setOpenNotificacion(false);
    setAnchorElNotificacion(null);
    setOpenUsuario(false);
    setAnchorElUsuario(null);
  };
  
  const handleCloseChecklist = () => {
    setAnchorElChecklist(null);
    setOpenChecklist(false);
  };

  return (
    <AppBar position="static" sx={{ borderRadius: " 0px 0px 15px 15px " }}>
      <Toolbar
        disableGutters
        sx={{
          display: "flex",
          width: "100%",
          height: "14vh",
          alignItems: "center",
        }}
      >
        {/* SECCION TITULO */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer", // Para que todo el grupo sea clickeable
          }}
          onClick={() => {
            routerPush("/");
          }}
        >
          <Box
            component="img"
            src="/YPF-sin-fondo.svg"
            sx={{
              mt: { md: -10, xs: 0 }, 
              ml: { md: 9, xs: 2 },
              height: {
                xs: 30,
                sm: 35, 
                md: 45, 
              },
              maxWidth: '100%', 
              objectFit: 'contain', 
            }}
          />

          <Divider
            orientation="vertical"
            sx={{ bgcolor: "#fff", height: 24, width: { md: 2 } }}
          />
          <Typography
            variant="h1"
            sx={{
              ml: { md: 13 },
              display: { xs: "none", md: "block" },
            }}
          >
            SRC
          </Typography>
        </Box>

        {/* SECCION BOTONES DEL MENU CELULAR*/}
        {!isSmallUp && (
          <ButtonsMobileAppBar
            handleOpenNavMenu={handleOpenNavMenu}
            anchorElNav={anchorElNav}
            handleCloseNavMenu={handleCloseNavMenu}
            pages={pages}
            handleClickChecklist={handleClickChecklist}
            handleClickNotificacion={handleClickNotificacion}
            handleClickUsuario={handleClickUsuario}
          />
        )}

        {/* SECCION BOTONES DEL MENU COMPU*/}
        {isSmallUp && (
          <ButtonsDestokAppBar
            handleCloseNavMenu={handleCloseNavMenu}
            pages={pages}
          />
        )}
        <Box sx={{
              display: "flex",
              gap: 10,
              mr: 10,
              alignItems: "center",
            }}>
        {/* PENDINGS */}
        <PendingTasksAppBar
          open={openChecklist}
          handleClick={handleClickChecklist}
          handleClose={handleCloseChecklist}
          anchorEl={anchorElChecklist}
        />
        {/* NOTIFICACIONES */}
        <NotificationAppBar
          open={openNotificacion}
          handleClick={handleClickNotificacion}
          handleClose={handleCloseNotificacion}
          anchorEl={anchorElNotificacion}
        />

        {/* AVATAR */}
        <UserProfileAppBar
          open={openUsuario}
          handleClick={handleClickUsuario}
          handleClose={handleCloseUsuario}
          anchorEl={anchorElUsuario}
        />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
