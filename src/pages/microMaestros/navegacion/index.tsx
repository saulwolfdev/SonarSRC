import { Box, Typography, TextField, Link, useTheme, InputAdornment } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/router";
import SearchIcon from '@mui/icons-material/Search';
const subpages = [
  { nombre: "Ubicación geográfica", url: "/microMaestros/ubicacionGeografica" },
  { nombre: "Centros físicos", url: "/microMaestros/centrosFisicos" },
  { nombre: "Clasificación de centros físicos", url: "/microMaestros/clasificacionCentrosFisicos" },
  { nombre: "Funciones estandarizadas", url: "/microMaestros/funcionEstandarizada" },
  { nombre: "Sociedades", url: "/microMaestros/sociedades" },
  { nombre: "Áreas", url: "/microMaestros/areas" },
  { nombre: "Tipo de contrato", url: "/microMaestros/tipoContrato" },
  { nombre: "Tipo de contratista", url: "/microMaestros/tipoContratista" },
  { nombre: "Compañías aseguradoras", url: "/microMaestros/companiasAseguradoras" },
  { nombre: "Tipos de seguros", url: "/microMaestros/tiposSeguro" },
  { nombre: "Motivos de bloqueo", url: "/microMaestros/motivosBloqueos" },
  { nombre: "Estudios auditores", url: "/microMaestros/estudiosAuditores" },
  { nombre: "Sedes de estudios auditores", url: "/microMaestros/sedesEstudiosAuditores" },
  { nombre: "Motivos de autorización temporal", url: "/microMaestros/motivosAutorizacionTemporal" },
  { nombre: "Motivo de reemplazo de contratos", url: "/microMaestros/motivoReemplazoContratos" },
  { nombre: "Incidencias", url: "/microMaestros/incidencias" },
  { nombre: "Estudios - Nivel de instrucción", url: "/microMaestros/nivelInstruccion" },
  { nombre: "Estudio - Título académico", url: "/microMaestros/titulosAcademicos" },
  { nombre: "Diagrama de trabajo", url: "/microMaestros/diagramaTrabajo" },
  { nombre: "Relación laboral", url: "/microMaestros/relacionLaboral" },
  { nombre: "Motivo de desafectación", url: "/microMaestros/motivoDesafectacion" },
  { nombre: "Causa de desafectación", url: "/microMaestros/causaDesafectacion" },
  { nombre: "Situación laboral", url: "/microMaestros/situacionLaboral" },
  { nombre: "Categoría de monotributo", url: "/microMaestros/categoriaMonotributo" },
  { nombre: "Tipos de unidades", url: "/microMaestros/tiposUnidades" },
  { nombre: "Estados de afectación", url: "/microMaestros/estadosAfectacion" },
  { nombre: "Requisitos", url: "/microMaestros/requisitos" },
  { nombre: "Motivos de rechazo de afectación", url: "/microMaestros/motivosRechazoAfectacion" },
  { nombre: "Aprobación de lugar de contratos", url: "/microMaestros/aprobacionLugarContratos" },
  { nombre: "Cursos", url: "/microMaestros/cursos" },
  { nombre: "Motivos de afectación", url: "/microMaestros/motivoAfectacion" },
];

const Navegacion = () => {
  const theme = useTheme();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSubpages = subpages
    .filter((page) =>
      page.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  return (
    <Box
      sx={{
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        overflow: "hidden",
        padding: theme.spacing(4),
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          mb: 3,
        }}
      >
        <Typography variant="h1" sx={{ mr: 3 }}>
          Configuración
        </Typography>

        <TextField
          placeholder="¿Qué estás buscando?"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: "250px",
            height: "36px",
            ml: "20px",
            mt: "15px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              paddingLeft: "10px",
            },
            "& input::placeholder": {
              color: "black",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "grey.600", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />



      </Box>

      <Box
        sx={{
          width: "100%",
          borderRadius: "8px",
          overflow: "hidden",
          mt: 4,
        }}
      >
        <Box
          sx={{
            border: "1px solid #D6D6D68A",
            backgroundColor: "#F5F5F5",
            padding: "10px",
          }}
        >
          <Typography variant="h2">Maestros</Typography>
        </Box>

        <Box
          sx={{
            border: "1px solid #D6D6D68A",
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: theme.spacing(10), // Increased gap between links
            }}
          >
            {filteredSubpages.map((page, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  paddingY: theme.spacing(1),
                }}
              >
                <Box
                  sx={{
                    width: "6px",
                    height: "6px",
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: "50%",
                    mr: 10,
                  }}
                />
                <Link
                  href={page.url}
                  underline="hover"
                  color="primary"
                  variant="body1"
                  sx={{
                    cursor: "pointer",
                    paddingY: theme.spacing(1),
                  }}
                >
                  {page.nombre}
                </Link>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Navegacion;
