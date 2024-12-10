import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  Button,
  Paper,
  Popper,
  TextField,
} from "@mui/material";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";

import AutocompleteFiltro from "@/components/shared/AutocompleteFiltro";
import { fetchEstados } from "@/services/microMaestros/GenericService";
import { IdOption } from "@/types/microMaestros/GenericTypes";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";
import { useSearchParams } from "next/navigation";

const PopperFiltrosClasificacionCentrosFisicos = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<IdOption | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const { modifyQueries, removeQueries } = useQueryString();

  // Sincronización de filtros al abrir el popup o al limpiar los filtros
  useEffect(() => {
    setNombre(searchParams.get("nombre") || "");
    setEstadoSeleccionado(
      searchParams.get("estado")
        ? { id: parseInt(searchParams.get("estado") as string), label: "" }
        : null
    );
  }, [searchParams.toString(), open]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };

  const handleApply = () => {
    const queries: IQuery[] = [];
    nombre && queries.push({ name: "nombre", value: nombre });
    estadoSeleccionado?.id &&
      queries.push({
        name: "estado",
        value: estadoSeleccionado.id.toString(),
      });

    modifyQueries(queries);
    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setNombre(null);
    setEstadoSeleccionado(null);
    removeQueries(["estado", "nombre"]);
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
                label="Nombre"
                value={nombre || ""}
                onChange={(e) => setNombre(e.target.value)}
                variant="outlined"
                size="small"
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
              <Button className="MuiButton-primary" variant="contained" onClick={handleApply}>
                Aplicar
              </Button>
            </Box>
          </Box>
        </Paper>
      </Popper>
    </Box>
  );
};

export default PopperFiltrosClasificacionCentrosFisicos;
