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
import { setEstados } from "@/services/microMaestros/EstudioAuditoresService";
import { IdOption } from "@/types/microMaestros/GenericTypes";
import { ListaLocalidadesRequest, ListaProvinciasRequest } from "@/types/microMaestros/ubicacionGeograficaTypes";
import { fetchLocalidades, fetchProvincias } from "@/services/microMaestros/ubicacionGeograficaService"
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";

export default function PopperFiltrosSedes() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [sedeSeleccionado, setEstudioAuditorSeleccionado] = useState<number | null>(null);
  const [nombreSedeSeleccionado, setNombreSedeSeleccionado] = useState<string | null>(null);
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<IdOption>()
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState<IdOption>()
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<IdOption>()

  const { modifyQueries, remove, removeQueries } = useQueryString();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };

  const handleApply = () => {
    const queries: IQuery[] = [];
    sedeSeleccionado && queries.push({ name: 'id', value: sedeSeleccionado.toString() });
    nombreSedeSeleccionado && queries.push({ name: 'nombre', value: nombreSedeSeleccionado.toString() });
    provinciaSeleccionada && queries.push({ name: 'provinciaId', value: provinciaSeleccionada.toString() });
    localidadSeleccionada && queries.push({ name: 'localidadId', value: localidadSeleccionada.toString() });
    estadoSeleccionado?.id && queries.push({ name: "estado", value: estadoSeleccionado?.id.toString() });


    modifyQueries(queries);
    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setEstudioAuditorSeleccionado(null);
    setNombreSedeSeleccionado(null);
    setProvinciaSeleccionada(undefined)
    setLocalidadSeleccionada(undefined)
    setEstadoSeleccionado(undefined)
    removeQueries(['id', 'nombre', 'provinciaId', 'localidadId']);
  }

  const handleClose = () => {
    setAnchorEl(null)
    setOpen(false)
  }


  const buscarProvincias = async (busqueda?: string): Promise<IdOption[]> => {
    const filtros: ListaProvinciasRequest = { nombre: busqueda }
    const listaProvincias = await fetchProvincias(filtros)

    return listaProvincias.data.map((p) => {
      const provinciaSeleccion: IdOption = {
        id: p.id,
        label: p.nombre,
      }
      return provinciaSeleccion
    })
  }

  const buscarLocalidades = async (busqueda?: string): Promise<IdOption[]> => {
    const filtros: ListaLocalidadesRequest = { nombre: busqueda }
    const listaLocalidades = await fetchLocalidades(filtros)

    return listaLocalidades.data.map((p) => {
      const localidadSeleccion: IdOption = {
        id: p.id,
        label: p.nombre,
      }
      return localidadSeleccion
    })
  }

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
              <TextField
                label="Código sede"
                size="small"
                value={sedeSeleccionado || sedeSeleccionado == 0 ? sedeSeleccionado : ""}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "") {
                    setEstudioAuditorSeleccionado(null);
                  } else {
                    const number = Number(value);
                    if (!isNaN(number)) {
                      setEstudioAuditorSeleccionado(number);
                    }
                  }
                }}
              />
              <TextField
                label="Nombre sede"
                size="small"
                value={nombreSedeSeleccionado}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "") {
                    setNombreSedeSeleccionado(null);
                  } else {
                    setNombreSedeSeleccionado(value);
                  }
                }}
              />

              <AutocompleteFiltro
                label="Provincia"
                value={provinciaSeleccionada || null}
                fetchOptions={buscarProvincias}
                getOptionLabel={(option) => option.label}
                onChange={(value) => value && setProvinciaSeleccionada(value)}
              />

              <AutocompleteFiltro
                label="Localidad"
                value={localidadSeleccionada || null}
                fetchOptions={buscarLocalidades}
                getOptionLabel={(option) => option.label}
                onChange={(value) => value && setLocalidadSeleccionada(value)}
              />

              <AutocompleteFiltro
                label="Estado"
                value={estadoSeleccionado || null}
                fetchOptions={setEstados}
                getOptionLabel={(option) => option.label}
                onChange={(value) => value && setEstadoSeleccionado(value)}
              />

            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
              }}
            >
              <Button variant="contained" color="primary" onClick={handleApply}>
                Aplicar
              </Button>
            </Box>
          </Box>
        </Paper>
      </Popper>
    </Box>
  );
}
