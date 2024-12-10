import React, { useState } from "react";
import {
  Popper,
  Box,
  Paper,
  IconButton,
  Typography,
  Button,
  Badge,
  TextField,
} from "@mui/material";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";

import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { IdOption } from "@/types/microMaestros/GenericTypes";
import AutocompleteFiltro from "@/components/shared/AutocompleteFiltro";
import { useFiltrosConsolidadosStore } from "@/zustand/microMaestros/gremios/consolidados/useFiltrosStore";
import { fetchEstados } from "@/services/microMaestros/GenericService";
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";

export default function PopperFiltrosGremiosConsolidados() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [
    codigoGremioConsolidadoSeleccionada,
    setCodigoGremioConsolidadoSeleccionada,
  ] = useState<string | null>(null);
  const [
    nombreGremioConsolidadoSeleccionada,
    setNombreGremioConsolidadoSeleccionada,
  ] = useState<string | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<{
    id: number;
    label: string;
  } | null>(null);
  const { modifyQueries, removeQueries } = useQueryString();

  const updateCodigo = useFiltrosConsolidadosStore((state) => state.updateCodigo)
  const updateNombre = useFiltrosConsolidadosStore((state) => state.updateNombre)
  const updateEstado = useFiltrosConsolidadosStore((state) => state.updateEstado)
  

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };

  const handleApply = () => {
    const queries: IQuery[] = [];
    codigoGremioConsolidadoSeleccionada &&
      queries.push({
        name: "codigo",
        value: codigoGremioConsolidadoSeleccionada.toString(),
      });
    nombreGremioConsolidadoSeleccionada &&
      queries.push({
        name: "nombre",
        value: nombreGremioConsolidadoSeleccionada,
      });
    estadoSeleccionado?.id &&
      queries.push({
        name: "estado",
        value: estadoSeleccionado?.id.toString(),
      });
    queries.push({ name: "pageNumber", value: "1" });

    modifyQueries(queries);

    codigoGremioConsolidadoSeleccionada &&  updateCodigo(Number(codigoGremioConsolidadoSeleccionada))
    nombreGremioConsolidadoSeleccionada && updateNombre(nombreGremioConsolidadoSeleccionada)
    estadoSeleccionado?.id && updateEstado(estadoSeleccionado?.id == 1)
    
    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setCodigoGremioConsolidadoSeleccionada(null);
    setNombreGremioConsolidadoSeleccionada(null);
    setEstadoSeleccionado(null);
    removeQueries(["codigo","nombre","estado"]);

    updateCodigo(undefined)
    updateNombre(undefined)
    updateEstado(undefined)
    
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
              borderRadius: "20px", // Aplica el borde redondeado de 20px
              opacity: 1,
            }}
          >          <Box sx={{ padding: "16px", width: "400px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
               <Typography sx={{ fontSize: 16, ml: 1.5, fontWeight: "semibold" }}>
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
                <Typography
                  sx={{ fontSize: 16, ml: 5, fontWeight: "semibold" }}
                  >
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
              {/* Código gremio consolidado */}
              <TextField
                size="small"
                label="Código gremio consolidado"
                value={codigoGremioConsolidadoSeleccionada}
                onChange={(e) =>
                  setCodigoGremioConsolidadoSeleccionada(e.target.value)
                }
              />

              {/* Nombre gremio consolidado */}
              <TextField
                size="small"
                label="Nombre gremio consolidado "
                value={nombreGremioConsolidadoSeleccionada}
                onChange={(e) =>
                  setNombreGremioConsolidadoSeleccionada(e.target.value)
                }
              />

              {/* Estado */}
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
              <Button className="MuiButton-secondary"variant="contained" onClick={handleClose}
                sx={{ marginRight: "8px" }}
              >
                Cancelar
              </Button>
              <Button className="MuiButton-primary"variant="contained" onClick={handleApply}>
                Aplicar
              </Button>
            </Box>
          </Box>
        </Paper>
      </Popper>
    </Box>
  );
}
