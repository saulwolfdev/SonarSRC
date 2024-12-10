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
import {
  fetchProvincias
} from "@/services/microMaestros/asociacionesGremialesService";
import { useFiltrosAsociacionesGremialesStore } from "@/zustand/microMaestros/gremios/asosiacionesGremiales/useFiltrosStore";
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";
import { fetchEstados } from "@/services/microMaestros/GenericService";

export default function PopperFiltrosAsociacionesGremiales() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [
    provinciaSeleccionada,
    setProvinciaSeleccionada,
  ] = useState<IdOption | null>(null);
  const [
    nombreAsociacionGremialSeleccionada,
    setNombreAsociacionGremialSeleccionada,
  ] = useState<string | null>(null);
  const [
    codigoAsociacionGremialSeleccionada,
    setCodigoAsociacionGremialSeleccionada,
  ] = useState<string | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<{
    id: number;
    label: string;
  } | null>(null);
  const { modifyQueries, removeQueries } = useQueryString();

  const updateCodigo = useFiltrosAsociacionesGremialesStore((state) => state.updateCodigo)
  const updateNombre = useFiltrosAsociacionesGremialesStore((state) => state.updateNombre)
  const updateEstado = useFiltrosAsociacionesGremialesStore((state) => state.updateEstado)
  const updateProvinciaId = useFiltrosAsociacionesGremialesStore((state) => state.updateProvinciaId)
  

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };

  const handleApply = () => {
    const queries: IQuery[] = [];
    provinciaSeleccionada?.id &&
      queries.push({
        name: "provinciaId",
        value: provinciaSeleccionada?.id.toString(),
      });
    nombreAsociacionGremialSeleccionada &&
      queries.push({
        name: "nombre",
        value: nombreAsociacionGremialSeleccionada,
      });
      codigoAsociacionGremialSeleccionada &&
      queries.push({
        name: "codigo",
        value: codigoAsociacionGremialSeleccionada,
      });
    estadoSeleccionado?.id &&
      queries.push({
        name: "estado",
        value: estadoSeleccionado?.id.toString(),
      });
    queries.push({ name: "pageNumber", value: "1" });

    modifyQueries(queries);

    codigoAsociacionGremialSeleccionada &&  updateCodigo(Number(codigoAsociacionGremialSeleccionada))
    nombreAsociacionGremialSeleccionada && updateNombre(nombreAsociacionGremialSeleccionada)
    estadoSeleccionado?.id && updateEstado(estadoSeleccionado?.id == 1)
    provinciaSeleccionada?.id && updateProvinciaId(provinciaSeleccionada?.id)
    
    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setProvinciaSeleccionada(null);
    setNombreAsociacionGremialSeleccionada(null);
    setCodigoAsociacionGremialSeleccionada(null)
    setEstadoSeleccionado(null);
    removeQueries(["provincia","nombre","codigo","estado"]);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  return (
    <Box>
      <IconButtonPopperFilter handleClick={handleClick} open={open} />

      <Popper open={open} anchorEl={anchorEl} placement="bottom-end">
        <Paper>
          <Box sx={{ padding: "16px", width: "400px" }}>
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
                  sx={{ fontSize: 16, ml: 1.5, fontWeight: "semibold" }}
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
               {/* Codigo asocicion gremial */}
               <TextField
                size='small'
                label="Codigo asocición gremial "
                value={codigoAsociacionGremialSeleccionada}
                onChange={(e) =>
                  setCodigoAsociacionGremialSeleccionada(e.target.value)
                }
              />
              {/* Nombre asocicion gremial */}
              <TextField
                size='small'
                label="Nombre asocición gremial "
                value={nombreAsociacionGremialSeleccionada}
                onChange={(e) =>
                  setNombreAsociacionGremialSeleccionada(e.target.value)
                }
              />
              {/* Provincia*/}
              <AutocompleteFiltro
                label="Provincia"
                value={provinciaSeleccionada}
                fetchOptions={fetchProvincias}
                onChange={(value) =>
                  setProvinciaSeleccionada(value)
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
