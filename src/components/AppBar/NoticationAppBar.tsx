import React, { useState } from "react";
import { IconButton, Popper, useTheme } from "@mui/material";

import {
  Badge,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
} from "@mui/material";

export const stylesArrowPopper = {
  arrow: {
    color: "white",
    position: "absolute",
    fontSize: 7,
    width: "3em",
    height: "3em",
    "&::before": {
      content: '""',
      margin: "auto",
      display: "block",
      width: 0,
      height: 0,
      borderStyle: "solid",
      borderWidth: "0 1.5em 3em 1.5em", // Ajusta los bordes para crear la flecha
      borderColor: "transparent transparent white transparent", // La flecha será blanca
    },
  },
};

import { NotificationsLarge } from "@/components/shared/Icons";

const notifications: Notification[] = [];

export default function NotificationAppBar({...props}) {
  const theme = useTheme();
const {open,  handleClick,  handleClose,  anchorEl} = props

  const [arrowRef, setArrowRef] = React.useState(null);

  const id = open ? "simple-popper" : undefined;

  return (
    <Box sx={{ fjustifyContent: 'end',height: "100%", display: { xs: "none", sm: "flex" } }}>

      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        sx={{
          color:"white",
          "&:hover": {
            backgroundColor: "white",
            color: theme.palette.primary.main,
          },
        }}
      >
        <Badge
          variant="dot"
          color="error"
          sx={{
            "& .MuiBadge-dot": {
              top: "8%",
              right: "8%",
              transform: "scale(1.2)",
            },
          }}
        >
          <NotificationsLarge />
        </Badge>
      </IconButton>

      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement="bottom"
        disablePortal={false}
        modifiers={[
          {
            name: "arrow",
            enabled: true,
            options: {
              element: arrowRef,
            },
          },
        ]}
      >
        <Box
          component="span"
          className="arrow"
          ref={setArrowRef}
          sx={stylesArrowPopper.arrow}
        />

        <Paper
          elevation={3}
          sx={{
            backgroundColor: { md: "#ffff" },
            p: { md: 3 },
            mt: { md: 10 },
            borderRadius: { md: "15px" },
            opacity: { md: "1" },
          }}
        >
          <Box>
            <List>
              <Typography
                gutterBottom
                sx={{
                  ml: { md: 27 },
                  mt: { md: 15 },
                  fontSize: { md: '18px' },
                  fontWeight: 'bold',
                }}
              >
                Notificaciones
              </Typography>
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={String(notification)} />
                  </ListItem>
                ))
              ) : (
                <Typography
                  sx={{
                    mt: { md: 25 },
                    mx: { md: 62 },
                    maskBorderSource: { md: 20 },
                    fontSize: { md: '14px' },
                    letterSpacing: { md: "0px" },
                    color: { md: " #7A7A7A" },
                    opacity: { md: "1" },
                  }}
                >
                  Aún no hay novedades por aquí.
                </Typography>
              )}
            </List>
            <hr style={{ border: "0.5px solid #C4C4C4", opacity: "0.5" }} />
            <Box textAlign="center">
              <Button
                variant="contained"
                sx={{
                  m: { md: 15 },
                  borderRadius: { md: "13px" },
                  opacity: { md: "1" },
                  backgroundColor: { md: "#0451DD" },
                }}
                onClick={handleClose}
              >
                Ver anteriores
              </Button>
            </Box>
          </Box>
        </Paper>
      </Popper>
    </Box>
  );
}
