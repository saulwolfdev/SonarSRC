"use client";

import { Box, Typography } from "@mui/material";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";

export default function NoExistenRegistros() {
  return (
    <Box
      sx={{
        mt: 150,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // Centrar horizontalmente
        alignItems: "center", // Centrar verticalmente
        width: "100%",
        height: "100%",
        textAlign: "center",
        marginBottom: 300
      }}
    >
      <ArticleOutlinedIcon sx={{ color: "#707070" }} fontSize="large" />
      <Typography variant="body1" sx={{ mt:10,fontWeight: "bold", color: "#707070" }}>
        Todavia no existen registros.
      </Typography>
      <Typography variant="body1" sx={{ color: "#707070" }}>
        Los podras encontrar aqui cuando esten disponibles.
      </Typography>
    </Box>
  );
}
