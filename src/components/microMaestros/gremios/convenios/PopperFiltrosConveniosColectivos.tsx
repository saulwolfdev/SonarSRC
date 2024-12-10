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
import { fetchEstados } from "@/services/microMaestros/GenericService";
import AutocompleteFiltro from "@/components/shared/AutocompleteFiltro";
import { useFiltrosConveniosStore } from "@/zustand/microMaestros/gremios/convenios/useFiltrosStore";
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";

export default function PopperFiltrosConveniosColectivos() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  const [codigo, setCodigo] = useState<string | null>(null);
  const [convenio, setConvenio] = useState<string | null>(null);
  const [horas, setHoras] = useState<string | null>(null);
  const [titulos, setTitulos] = useState<string | null>(null);
  const [zonas, setZonas] = useState<string | null>(null);
  const [turnos, setTurnos] = useState<string | null>(null);

  const [estadoSeleccionado, setEstadoSeleccionado] = useState<{
    id: number;
    label: string;
  } | null>(null);
  const { modifyQueries, removeQueries } = useQueryString();

  const updateCodigo = useFiltrosConveniosStore((state) => state.updateCodigo)
  const updateNombre = useFiltrosConveniosStore((state) => state.updateNombre)
  const updateHorasDiariasDeTrabajo = useFiltrosConveniosStore((state) => state.updateHorasDiariasDeTrabajo)
  const updateNombreTitulo = useFiltrosConveniosStore((state) => state.updateNombreTitulo)
  const updateNombreZona = useFiltrosConveniosStore((state) => state.updateNombreZona)
  const updateNombreTurno = useFiltrosConveniosStore((state) => state.updateNombreTurno)
  const updateEstado = useFiltrosConveniosStore((state) => state.updateEstado)


  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };

  const handleApply = () => {
    const queries: IQuery[] = [];
    codigo && queries.push({ name: "codigo", value: codigo });
    convenio && queries.push({ name: "nombre", value: convenio });
    horas && queries.push({ name: "horasDiariasDeTrabajo", value: horas });
    titulos && queries.push({ name: "nombreTitulo", value: titulos });
    zonas && queries.push({ name: "nombreZonas", value: zonas });
    turnos && queries.push({ name: "nombreTurnos", value: turnos });

    estadoSeleccionado?.id &&
      queries.push({
        name: "estado",
        value: estadoSeleccionado?.id.toString(),
      });
    queries.push({ name: "pageNumber", value: "1" });

    modifyQueries(queries);

    codigo &&  updateCodigo(Number(codigo))
    convenio && updateNombre(convenio)
    horas && updateHorasDiariasDeTrabajo(horas)
    titulos && updateNombreTitulo(titulos)
    zonas &&  updateNombreZona(zonas)
    turnos &&  updateNombreTurno(turnos)
    estadoSeleccionado?.id && updateEstado(estadoSeleccionado?.id == 1)

    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setCodigo(null);
    setEstadoSeleccionado(null);
    setConvenio(null);
    setHoras(null);
    setTitulos(null);
    setZonas(null);
    setTurnos(null);
    removeQueries(["codigo", "estado", "nombre", "horasDiariasDeTrabajo", "nombreTitulo", "nombreZonas", "nombreTurnos"]);
  
    updateCodigo(undefined)
    updateNombre(undefined)
    updateHorasDiariasDeTrabajo(undefined)
    updateNombreTitulo(undefined)
    updateNombreZona(undefined)
    updateNombreTurno(undefined)
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
        <Paper>
          <Box sx={{ padding: "16px", width: "900px" }}>
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
                display: "grid",
                gridTemplateColumns: "1fr 1fr", // Dos columnas iguales
                gap: "16px",
                marginTop: "16px",
              }}
            >
               <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
              {/* Codigo*/}
              <TextField
                size="small"
                label="Codigo"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
              {/* Convenio*/}
              <TextField
                size="small"
                label="Convenio"
                value={convenio}
                onChange={(e) => setConvenio(e.target.value)}
              />
              {/* Horas de trabajo diarias*/}
              <TextField
                size="small"
                label="Horas de trabajo diarias"
                value={horas}
                onChange={(e) => setHoras(e.target.value)}
              />
              {/* Títulos*/}
              <TextField
                size="small"
                label="Títulos"
                value={titulos}
                onChange={(e) => setTitulos(e.target.value)}
              />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
              {/* Zonas*/}
              <TextField
                size="small"
                label="Zonas"
                value={zonas}
                onChange={(e) => setZonas(e.target.value)}
              />
              {/* Turnos*/}
              <TextField
                size="small"
                label="Turnos"
                value={turnos}
                onChange={(e) => setTurnos(e.target.value)}
              />

              {/* Estado */}
              <AutocompleteFiltro
                label="Estado"
                value={estadoSeleccionado}
                fetchOptions={fetchEstados}
                onChange={(value) => setEstadoSeleccionado(value)}
              />
              </Box>
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
