"use client";

import { Box, Typography } from "@mui/material";
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';

export default function FiltradoSinDatos() {
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
      <FindInPageOutlinedIcon sx={{ color: "#707070" }} fontSize="large" />
      <Typography variant="body1" sx={{ mt:10, fontWeight: "bold", color: "#707070" }}>
      Sin datos.
      </Typography>
      <Typography variant="body1" sx={{ color: "#707070" }}>
      Parece que no se encontraron coincidencias.
      </Typography>
    </Box>
  );
}
