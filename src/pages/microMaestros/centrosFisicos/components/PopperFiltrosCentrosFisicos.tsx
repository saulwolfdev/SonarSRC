import React, { useState, useEffect } from "react";
import {
  Popper,
  Box,
  Paper,
  IconButton,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";

import AutocompleteFiltro from "@/components/shared/AutocompleteFiltro";
import {
  fetchClasificaciones,
  fetchProvincias,
} from "@/services/microMaestros/centroFisicoService";
import {
  IdOption,
} from "@/types/microMaestros/GenericTypes";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";
import { useSearchParams } from "next/navigation"; // Hook para monitorear los parámetros de búsqueda
import { fetchEstados } from "@/services/microMaestros/GenericService";

export default function PopperFiltrosCentrosFisicos() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState<string>("");
  const [clasificacionSeleccionada, setClasificacionSeleccionada] =
    useState<IdOption | null>(null);
  const [provinciaSeleccionada, setProvinciaSeleccionada] =
    useState<IdOption | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<{
    id: number;
    label: string;
  } | null>(null);
  
  const searchParams = useSearchParams(); // Hook para acceder a los parámetros de búsqueda
  const { modifyQueries, removeQueries } = useQueryString();

  // Sincroniza los estados de los filtros con los valores en `searchParams` cuando se abren los filtros
  useEffect(() => {
    setNombre(searchParams.get("nombre") || "");
    setClasificacionSeleccionada(
      searchParams.get("clasificacionId")
        ? { id: Number(searchParams.get("clasificacionId")), label: "" }
        : null
    );
    setProvinciaSeleccionada(
      searchParams.get("provinciaId")
        ? { id: Number(searchParams.get("provinciaId")), label: "" }
        : null
    );
    setEstadoSeleccionado(
      searchParams.get("estado")
        ? { id: Number(searchParams.get("estado")), label: "" }
        : null
    );
  }, [searchParams.toString(), open]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };

  const handleApply = () => {
    const queries: IQuery[] = [];
    clasificacionSeleccionada?.id &&
      queries.push({
        name: "clasificacionId",
        value: clasificacionSeleccionada.id.toString(),
      });
    provinciaSeleccionada?.id &&
      queries.push({
        name: "provinciaId",
        value: provinciaSeleccionada.id.toString(),
      });
    estadoSeleccionado?.id &&
      queries.push({
        name: "estado",
        value: estadoSeleccionado.id.toString(),
      });
    nombre && queries.push({ name: "nombre", value: nombre });
    queries.push({ name: "pageNumber", value: "1" });

    modifyQueries(queries);
    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setNombre("");
    setClasificacionSeleccionada(null);
    setProvinciaSeleccionada(null);
    setEstadoSeleccionado(null);
    removeQueries(["clasificacionId", "provinciaId", "estado", "nombre"]);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  return (
    <Box>
      <IconButtonPopperFilter handleClick={handleClick} open={open} />
      <Popper open={open} anchorEl={anchorEl} placement="bottom-end">
        <Paper
          sx={{
            background: "#FFFFFF",
            boxShadow: "4px 4px 10px #D6D6D6",
            border: "0.5px solid #7070701A",
            borderRadius: "20px",
            opacity: 1,
          }}
        >
          <Box sx={{ padding: "16px", width: "400px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                id="modal-title"
                variant="body1"
                sx={{ fontWeight: "bold" }}
              >
                Filtros
              </Typography>
              <IconButton
                onClick={handleLimpiarFiltros}
                sx={{
                  color: "primary.main",
                  textAlign: "right",
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                <BackspaceOutlinedIcon sx={{ fontSize: 20 }} />
                <Typography sx={{ fontSize: 16, ml: 5, fontWeight: "semibold" }}>
                  Limpiar filtros
                </Typography>
              </IconButton>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                marginTop: "16px",
              }}
            >
              <TextField
                label={"Nombre"}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                variant="outlined"
                size="small"
              />

              <AutocompleteFiltro
                label="Clasificación"
                value={clasificacionSeleccionada}
                fetchOptions={fetchClasificaciones}
                onChange={(value) => setClasificacionSeleccionada(value)}
              />

              <AutocompleteFiltro
                label="Provincia"
                value={provinciaSeleccionada}
                fetchOptions={fetchProvincias}
                onChange={(value) => setProvinciaSeleccionada(value)}
              />

              <AutocompleteFiltro
                label="Estado"
                value={estadoSeleccionado}
                fetchOptions={fetchEstados}
                onChange={(value) => setEstadoSeleccionado(value)}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
              }}
            >
              <Button
                className="MuiButton-secondary"
                variant="contained"
                onClick={handleClose}
                sx={{ marginRight: "8px" }}
              >
                Cancelar
              </Button>
              <Button
                className="MuiButton-primary"
                variant="contained"
                onClick={handleApply}
              >
                Aplicar
              </Button>
            </Box>
          </Box>
        </Paper>
      </Popper>
    </Box>
  );
}
