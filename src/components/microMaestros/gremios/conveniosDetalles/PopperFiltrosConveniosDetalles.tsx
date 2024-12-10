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
import AutocompleteFiltro from "@/components/shared/AutocompleteFiltro";
import { fetchEstados } from "@/services/microMaestros/GenericService";

import { useFiltrosConveniosTitulosStore } from "@/zustand/microMaestros/gremios/conveniosDetalles/useFiltrosTitulosStore";
import { useFiltrosConveniosCategoriasStore } from "@/zustand/microMaestros/gremios/conveniosDetalles/useFiltrosCategoriasStore";
import { useFiltrosConveniosZonasStore } from "@/zustand/microMaestros/gremios/conveniosDetalles/useFiltrosZonasStore";
import { useFiltrosConveniosTurnosStore } from "@/zustand/microMaestros/gremios/conveniosDetalles/useFiltrosTurnosStore";
import { getFilters } from "@/utils/microMaestros/conveniosDetallesUtils";
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";

export default function PopperFiltrosConveniosDetalles({ page, setFilters }: { page: "titulo" | "zona" | "turno" | "categoria" , setFilters:any}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [
    codigo,
    setCodigo,
  ] = useState<string | null>(null);
  const [
    nombre,
    setNombre,
  ] = useState<string | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<{
    id: number;
    label: string;
  } | null>(null);
  const { modifyQueries, removeQueries } = useQueryString();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };
  
  const {updateCodigoFiltroConvenioTitulo,updateNombreFiltroConvenioTitulo, updateEstadoFiltroConvenioTitulo} = useFiltrosConveniosTitulosStore()
  const {updateCodigoFiltroConvenioCategoria,updateNombreFiltroConvenioCategoria,updateEstadoFiltroConvenioCategoria} = useFiltrosConveniosCategoriasStore()
  const {updateCodigoFiltroConvenioZona,updateNombreFiltroConvenioZona ,updateEstadoFiltroConvenioZona } = useFiltrosConveniosZonasStore()
  const {updateCodigoFiltroConvenioTurno,updateNombreFiltroConvenioTurno,updateEstadoFiltroConvenioTurno} = useFiltrosConveniosTurnosStore()

  const handleApply = () => {
    handleApplySwitch()
    handleClose();
  };

  const handleApplySwitch = () =>{
    getFilters(setFilters, codigo, nombre, estadoSeleccionado?.id)
    switch ( page )
     {
      case 'titulo':   
      codigo &&  updateCodigoFiltroConvenioTitulo(Number(codigo))
      nombre && updateNombreFiltroConvenioTitulo(nombre)
      estadoSeleccionado?.id && updateEstadoFiltroConvenioTitulo(estadoSeleccionado?.id == 1)
      break;
      
      case 'categoria':
        codigo &&  updateCodigoFiltroConvenioCategoria(Number(codigo))
        nombre && updateNombreFiltroConvenioCategoria(nombre)
        estadoSeleccionado?.id && updateEstadoFiltroConvenioCategoria(estadoSeleccionado?.id == 1)
        break;
      case 'zona':
        codigo &&  updateCodigoFiltroConvenioZona(Number(codigo))
        nombre && updateNombreFiltroConvenioZona(nombre)
        estadoSeleccionado?.id && updateEstadoFiltroConvenioZona(estadoSeleccionado?.id == 1)
        break;
      case 'turno':
        codigo &&  updateCodigoFiltroConvenioTurno(Number(codigo))
        nombre && updateNombreFiltroConvenioTurno(nombre)
        estadoSeleccionado?.id && updateEstadoFiltroConvenioTurno(estadoSeleccionado?.id == 1)
        break;
    }

  }
  
  const handleLimpiarFiltros = () => {
    setCodigo(null);
    setNombre(null);
    setEstadoSeleccionado(null);
    setFilters([])
    handleLimpiarFiltrosSwitch()
  };

  const handleLimpiarFiltrosSwitch = () =>{
    switch ( page )
    {
      case 'titulo':   
        updateCodigoFiltroConvenioTitulo(undefined)
        updateNombreFiltroConvenioTitulo(undefined)
        updateEstadoFiltroConvenioTitulo(undefined)
        break;    
      case 'categoria':
        updateCodigoFiltroConvenioCategoria(undefined)
        updateNombreFiltroConvenioCategoria(undefined)
        updateEstadoFiltroConvenioCategoria(undefined)
        break;
      case 'zona':
        updateCodigoFiltroConvenioZona(undefined)
        updateNombreFiltroConvenioZona(undefined)
        updateEstadoFiltroConvenioZona(undefined)
        break;
      case 'turno':
        updateCodigoFiltroConvenioTurno(undefined)
        updateNombreFiltroConvenioTurno(undefined)
        updateEstadoFiltroConvenioTurno(undefined)
        break;
   }
  }

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
              {/* Código*/}
              <TextField
                size="small"
                label="Código"
                value={codigo || ''}
                onChange={(e) =>
                  setCodigo(e.target.value)
                }
              />

              {/* Nombre*/}
              <TextField
                size="small"
                label="Nombre"
                value={nombre || ''}
                onChange={(e) =>
                  setNombre(e.target.value)
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
