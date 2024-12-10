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
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";

export default function PopperFiltrosReferentes() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [referenteSeleccionado, setEstudioAuditorSeleccionado] = useState<number | null>(null);
  const [nombreReferenteSeleccionado, setNombreReferenteSeleccionado] = useState<string | null>(null);
  const [rolSeleccionado, setRolSeleccionado] = useState<string | null>(null)
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<IdOption>()

  const { modifyQueries, remove, removeQueries } = useQueryString();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };

  const handleApply = () => {
    const queries: IQuery[] = [];
    referenteSeleccionado && queries.push({ name: 'id', value: referenteSeleccionado.toString() });
    nombreReferenteSeleccionado && queries.push({ name: 'nombre', value: nombreReferenteSeleccionado.toString() });
    rolSeleccionado && queries.push({ name: 'rolEspecialidad', value: rolSeleccionado.toString() });
    estadoSeleccionado?.id && queries.push({ name: "estado", value: estadoSeleccionado?.id.toString() });


    modifyQueries(queries);
    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setEstudioAuditorSeleccionado(null);
    setNombreReferenteSeleccionado(null);
    setRolSeleccionado(null)
    setEstadoSeleccionado(undefined)
    removeQueries(['id', 'nombre', 'rolEspecialidad', 'estado']);
  }

  const handleClose = () => {
    setAnchorEl(null)
    setOpen(false)
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
                label="Código referente"
                size="small"
                value={referenteSeleccionado || referenteSeleccionado == 0 ? referenteSeleccionado : ""}
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
                label="Nombre referente"
                size="small"
                value={nombreReferenteSeleccionado}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "") {
                    setNombreReferenteSeleccionado(null);
                  } else {
                    setNombreReferenteSeleccionado(value);
                  }
                }}
              />

              <TextField
                label="Rol"
                size="small"
                value={nombreReferenteSeleccionado}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "") {
                    setRolSeleccionado(null);
                  } else {
                    setRolSeleccionado(value);
                  }
                }}
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
