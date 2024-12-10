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
  fetchProvincias,
} from "@/services/microMaestros/consolidadorService";
import { useFiltrosConsolidadoresStore } from "@/zustand/microMaestros/gremios/consolidadores/useFiltrosStore";
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";
import { fetchEstados } from "@/services/microMaestros/GenericService";



export default function PopperFiltrosGremiosConsolidadores() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [
    codigoGremioConsolidadorSeleccionada,
    setCodigoGremioConsolidadorSeleccionada,
  ] = useState<string | null>(null);
  const [
    nombreGremioConsolidadorSeleccionada,
    setNombreGremioConsolidadorSeleccionada,
  ] = useState<string | null>(null);
  const [
    estadoSeleccionado,
    setEstadoSeleccionado
  ] = useState<{
    id: number;
    label: string;
  } | null>(null);
  const [
    nombreGremioConsolidadoSeleccionada,
    setNombreGremioConsolidadoSeleccionada,
  ] = useState<string | null>(null);
  const [
    nombreAsociacionGremialSeleccionada,
    setNombreAsociacionGremialSeleccionada,
  ] = useState<string | null>(null);
  const [
    nombreProvinciaSeleccionada,
    setProvinciaSeleccionada,
  ] = useState<IdOption | null>(null);
  const [
    nombreConvenioSeleccionada,
    setConvenioSeleccionada,
  ] = useState<string | null>(null);
  const { modifyQueries, removeQueries } = useQueryString();

  const updateCodigo = useFiltrosConsolidadoresStore((state) => state.updateCodigo)
  const updateNombre = useFiltrosConsolidadoresStore((state) => state.updateNombre)
  const updateEstado = useFiltrosConsolidadoresStore((state) => state.updateEstado)
  const updateNombreGremioConsolidado = useFiltrosConsolidadoresStore((state) => state.updateNombreGremioConsolidado)
  const updateNombreAsociacionGremial = useFiltrosConsolidadoresStore((state) => state.updateNombreAsociacionGremial)
  const updateProvinciaId = useFiltrosConsolidadoresStore((state) => state.updateProvinciaId)
  const updateNombreConvenioColectivo = useFiltrosConsolidadoresStore((state) => state.updateNombreConvenioColectivo)


  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };

  const handleApply = () => {
    const queries: IQuery[] = [];
    codigoGremioConsolidadorSeleccionada &&
      queries.push({
        name: "codigo",
        value: codigoGremioConsolidadorSeleccionada,
      });
    nombreGremioConsolidadorSeleccionada &&
      queries.push({
        name: "nombre",
        value: nombreGremioConsolidadorSeleccionada,
      });
    estadoSeleccionado?.id &&
      queries.push({
        name: "estado",
        value: estadoSeleccionado?.id.toString(),
      });
    nombreGremioConsolidadoSeleccionada &&
      queries.push({
        name: "nombreGremioConsolidado",
        value: nombreGremioConsolidadoSeleccionada,
      });
    nombreAsociacionGremialSeleccionada &&
      queries.push({
        name: "nombreAsociacionGremial",
        value: nombreAsociacionGremialSeleccionada,
      });
    nombreProvinciaSeleccionada?.id &&
      queries.push({
        name: "provinciaId",
        value: nombreProvinciaSeleccionada?.id.toString(),
      });
    nombreConvenioSeleccionada &&
      queries.push({
        name: "nombreConvenioColectivo",
        value: nombreConvenioSeleccionada,
      });
    queries.push({ name: "pageNumber", value: "1" });

    modifyQueries(queries);

    codigoGremioConsolidadorSeleccionada &&  updateCodigo(Number(codigoGremioConsolidadorSeleccionada))
    nombreGremioConsolidadorSeleccionada && updateNombre(nombreGremioConsolidadorSeleccionada)
    estadoSeleccionado?.id && updateEstado(estadoSeleccionado?.id == 1)
    nombreGremioConsolidadoSeleccionada && updateNombreGremioConsolidado(nombreGremioConsolidadoSeleccionada)
    nombreAsociacionGremialSeleccionada && updateNombreAsociacionGremial(nombreAsociacionGremialSeleccionada)
    nombreProvinciaSeleccionada?.id && updateProvinciaId(nombreProvinciaSeleccionada?.id)
    nombreConvenioSeleccionada &&  updateNombreConvenioColectivo(nombreConvenioSeleccionada)

    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setCodigoGremioConsolidadorSeleccionada(null);
    setNombreGremioConsolidadorSeleccionada(null);
    setEstadoSeleccionado(null);
    setNombreGremioConsolidadoSeleccionada(null);
    setNombreAsociacionGremialSeleccionada(null);
    setProvinciaSeleccionada(null);
    setConvenioSeleccionada(null);
    removeQueries(["codigo", "nombre", "estado", "nombreGremioConsolidado", "nombreAsociacionGremial", "provinciaId", "nombreConvenioColectivo"]);
    updateCodigo(undefined)
    updateNombre(undefined)
    updateEstado(undefined)
    updateNombreGremioConsolidado(undefined)
    updateNombreAsociacionGremial(undefined)
    updateProvinciaId(undefined)
    updateNombreConvenioColectivo(undefined)
 
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
              <Typography
                sx={{ fontSize: 16, ml: 1.5, fontWeight: "semibold" }}
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
              {/* Código gremio consolidador */}
              <TextField
                size="small"
                label="Código gremio consolidador"
                value={codigoGremioConsolidadorSeleccionada}
                onChange={(e) =>
                  setCodigoGremioConsolidadorSeleccionada(e.target.value)
                }
              />

              {/* Nombre Gremio Consolidador */}
              <TextField
                size="small"
                label="Nombre gremio consolidador"
                value={nombreGremioConsolidadorSeleccionada}
                onChange={(e) =>
                  setNombreGremioConsolidadorSeleccionada(e.target.value)
                }
              />

              {/* Estado */}
              <AutocompleteFiltro
                label="Estado gremio consolidador"
                value={estadoSeleccionado}
                fetchOptions={fetchEstados}
                onChange={(value) => setEstadoSeleccionado(value)}
              />

              {/* Nombre Gremio Consolidado */}
              <TextField
                size="small"
                label="Nombre gremio consolidado"
                value={nombreGremioConsolidadoSeleccionada}
                onChange={(e) =>
                  setNombreGremioConsolidadoSeleccionada(e.target.value)
                }
              />

              {/* Nombre Asociacion Gremial */}
              <TextField
                size="small"
                label="Nombre asociación gremial"
                value={nombreAsociacionGremialSeleccionada}
                onChange={(e) =>
                  setNombreAsociacionGremialSeleccionada(e.target.value)
                }
              />

              {/* Provincia */}
              <AutocompleteFiltro
                label="Provincia"
                value={nombreProvinciaSeleccionada}
                fetchOptions={fetchProvincias}
                onChange={(value) => setProvinciaSeleccionada(value)}
              />

              {/* Nombre convenio */}
              <TextField
                size="small"
                label="Nombre convenio"
                value={nombreConvenioSeleccionada}
                onChange={(e) => setConvenioSeleccionada(e.target.value)}
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
