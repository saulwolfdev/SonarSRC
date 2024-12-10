import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined"
import { Box, Button, IconButton, Paper, Popper, Typography } from "@mui/material"
import React, { useState } from "react"

import {
  fetchCodigosPostales,
  fetchLocalidades,
  fetchPaises,
  fetchProvincias,
} from "@/services/microMaestros/ubicacionGeograficaService"
import {
  ListaCodigosPostalesRequest,
  ListaLocalidadesRequest,
  ListaPaisesRequest,
  ListaProvinciasRequest,
} from "@/types/microMaestros/ubicacionGeograficaTypes"
import useQueryString, { IQuery } from "@/hooks/useQueryString"
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter"
import AutocompleteFiltro from "@/components/shared/AutocompleteFiltro"
import { fetchEstados } from "@/services/microMaestros/GenericService"
import { IdOption } from "@/types/microMaestros/GenericTypes"

export default function PopperFiltros() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const [paisSeleccionado, setPaisSeleccionado] = useState<IdOption>()
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<IdOption>()
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState<IdOption>()
  const [codigoPostalSeleccionado, setCodigoPostalSeleccionado] = useState<IdOption>()
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<IdOption | null>()
  const { modifyQueries, removeQueries } = useQueryString()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
    setOpen(!open)
  }

  const handleApply = () => {
    const queries: IQuery[] = []
    paisSeleccionado?.id && queries.push({ name: "paisId", value: paisSeleccionado?.id.toString() })
    provinciaSeleccionada?.id &&
      queries.push({ name: "provinciaId", value: provinciaSeleccionada?.id.toString() })
    localidadSeleccionada?.id &&
      queries.push({ name: "localidadId", value: localidadSeleccionada?.id.toString() })
    codigoPostalSeleccionado?.id &&
      queries.push({ name: "codigoPostalId", value: codigoPostalSeleccionado?.id.toString() })
    estadoSeleccionado?.id &&
      queries.push({ name: "estado", value: estadoSeleccionado?.id.toString() })
    queries.push({ name: "pageNumber", value: "1" })

    console.log(codigoPostalSeleccionado)
    modifyQueries(queries)
    handleClose()
  }

  const handleLimpiarFiltros = () => {
    setPaisSeleccionado(undefined)
    setProvinciaSeleccionada(undefined)
    setLocalidadSeleccionada(undefined)
    setCodigoPostalSeleccionado(undefined)
    setEstadoSeleccionado(undefined)
    removeQueries(["paisId", "provinciaId", "localidadId", "codigoPostalId", "estado"]);
  }

  const handleClose = () => {
    setAnchorEl(null)
    setOpen(false)
  }

  const buscarPaises = async (busqueda?: string): Promise<IdOption[]> => {
    const filtros: ListaPaisesRequest = { nombre: busqueda }
    const listaPaises = await fetchPaises(filtros)

    return listaPaises.data.map((p) => {
      const paisSeleccion: IdOption = {
        id: p.id,
        label: p.nombre,
      }
      return paisSeleccion
    })
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

  const buscarCodigosPostales = async (busqueda?: string): Promise<IdOption[]> => {
    const filtros: ListaCodigosPostalesRequest = { nombre: busqueda }
    const listaCodigosPostales = await fetchCodigosPostales(filtros)

    return listaCodigosPostales.data.map((p) => {
      const codigoPostalSeleccion: IdOption = {
        id: p.id,
        label: p.codigo,
      }
      return codigoPostalSeleccion
    })
  }


  return (
    <Box sx={{ flexGrow: 1, textAlign: "end" }}>
      <IconButtonPopperFilter handleClick={handleClick} open={open} />

      <Popper
        id={open ? "simple-popper" : undefined}
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
      >
        <Paper
          elevation={3}
          sx={{
            backgroundColor: "#FFFFFF",
            padding: 16,
            width: 400,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Typography
              id="modal-title"
              variant="h6"
              component="h3"
              sx={{ fontSize: 16, fontWeight: "bold" }}
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

          <Box sx={{ display: "flex", flexDirection: "column", gap: 16, mt: 2 }}>
            <AutocompleteFiltro
              label="País"
              value={paisSeleccionado || null}
              fetchOptions={buscarPaises}
              getOptionLabel={(option) => option.label}
              onChange={(value) => value && setPaisSeleccionado(value)}
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
              label="Código Postal"
              value={codigoPostalSeleccionado || null}
              fetchOptions={buscarCodigosPostales}
              getOptionLabel={(option) => option.label}
              onChange={(value) => value && setCodigoPostalSeleccionado(value)}
            />

            <AutocompleteFiltro
              label="Estado"
              value={estadoSeleccionado || null}
              fetchOptions={fetchEstados}
              getOptionLabel={(option) => option.label}
              onChange={(value) => setEstadoSeleccionado(value)}
            />

          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 16 }}>
            <Button className="MuiButton-secondary" variant="contained" onClick={handleClose}
              sx={{ marginRight: "8px" }}
            >
              Cancelar
            </Button>
            <Button className="MuiButton-primary" variant="contained" onClick={handleApply}>
              Aplicar
            </Button>
          </Box>
        </Paper>
      </Popper>
    </Box>
  )
}
