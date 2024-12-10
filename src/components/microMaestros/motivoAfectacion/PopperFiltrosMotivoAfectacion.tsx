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
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import AutocompleteFiltro from "@/components/shared/AutocompleteFiltro";
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";
import { useSearchParams } from "next/navigation"; // Para monitorear parámetros de búsqueda
import { buscarRelacionServicio, setEstados, setEstadosMotivos } from "@/services/microMaestros/motivoAfectacionService";
import { IdOption } from "@/types/microMaestros/GenericTypes";

export default function PopperFiltrosMotivoAfectacion() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [codigoSeleccionado, setCodigoSeleccionado] = useState<number | null>(null);
  const [motivoDeAfectacionSeleccionado, setMotivoDeAfectacionSeleccionado] = useState<string | null>(null);
  const [relacionServicioSeleccionado, setRelacionServicioSeleccionado] = useState<IdOption | null>(null);
  const [fechaIncorporacionSeleccionado, setFechaIncorporacionSeleccionado] = useState<IdOption | null>(null);
  const [bajaPorCesionSeleccionado, setBajaPorCesionSeleccionado] = useState<IdOption | null>(null);
  const [afectacionTemporalSeleccionado, setAfectacionTemporalSeleccionado] = useState<IdOption | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<IdOption | null>(null);

  const searchParams = useSearchParams();
  const { modifyQueries, removeQueries } = useQueryString();

  // Sincroniza los estados de los filtros al abrir el popup o al modificar los parámetros de búsqueda
  useEffect(() => {
    setCodigoSeleccionado(
      searchParams.get("id") ? parseInt(searchParams.get("id") as string, 10) : null
    );
    setMotivoDeAfectacionSeleccionado(searchParams.get("motivoDeAfectacion") || null);
    setRelacionServicioSeleccionado(
      searchParams.get("relacionesServicio")
        ? { id: parseInt(searchParams.get("relacionesServicio") as string, 10), label: "" }
        : null
    );
    setFechaIncorporacionSeleccionado(
      searchParams.get("fechaIncorporacion")
        ? { id: parseInt(searchParams.get("fechaIncorporacion") as string, 10), label: "" }
        : null
    );
    setBajaPorCesionSeleccionado(
      searchParams.get("bajaPorCesion")
        ? { id: parseInt(searchParams.get("bajaPorCesion") as string, 10), label: "" }
        : null
    );
    setAfectacionTemporalSeleccionado(
      searchParams.get("afectacionTemporal")
        ? { id: parseInt(searchParams.get("afectacionTemporal") as string, 10), label: "" }
        : null
    );
    setEstadoSeleccionado(
      searchParams.get("estado")
        ? { id: parseInt(searchParams.get("estado") as string, 10), label: "" }
        : null
    );
  }, [searchParams.toString(), open]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };

  const handleApply = () => {
    const queries: IQuery[] = [];
    if (codigoSeleccionado !== null) {
      queries.push({ name: "id", value: codigoSeleccionado.toString() });
    }
    if (motivoDeAfectacionSeleccionado) {
      queries.push({ name: "motivoDeAfectacion", value: motivoDeAfectacionSeleccionado });
    }
    if (relacionServicioSeleccionado) {
      queries.push({ name: "relacionesServicio", value: relacionServicioSeleccionado.id.toString() });
    }
    if (fechaIncorporacionSeleccionado) {
      queries.push({ name: "fechaIncorporacion", value: fechaIncorporacionSeleccionado.id.toString() });
    }
    if (bajaPorCesionSeleccionado) {
      queries.push({ name: "bajaPorCesion", value: bajaPorCesionSeleccionado.id.toString() });
    }
    if (afectacionTemporalSeleccionado) {
      queries.push({ name: "afectacionTemporal", value: afectacionTemporalSeleccionado.id.toString() });
    }
    if (estadoSeleccionado) {
      queries.push({ name: "estado", value: estadoSeleccionado.id.toString() });
    }

    modifyQueries(queries);
    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setCodigoSeleccionado(null);
    setMotivoDeAfectacionSeleccionado(null);
    setRelacionServicioSeleccionado(null);
    setFechaIncorporacionSeleccionado(null);
    setBajaPorCesionSeleccionado(null);
    setAfectacionTemporalSeleccionado(null);
    setEstadoSeleccionado(null);
    removeQueries(["id", "motivoDeAfectacion", "relacionesServicio", "fechaIncorporacion", "bajaPorCesion", "afectacionTemporal", "estado"]);
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
                label="Código"
                size="small"
                value={codigoSeleccionado ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  setCodigoSeleccionado(value === "" ? null : Number(value));
                }}
              />
              <TextField
                label="Motivo de afectación"
                size="small"
                value={motivoDeAfectacionSeleccionado ?? ""}
                onChange={(event) => setMotivoDeAfectacionSeleccionado(event.target.value || null)}
              />
              <AutocompleteFiltro
                label="Relación de servicio"
                value={relacionServicioSeleccionado || null}
                fetchOptions={buscarRelacionServicio}
                getOptionLabel={(option) => option.label}
                onChange={(value) => setRelacionServicioSeleccionado(value || null)}
              />
              <AutocompleteFiltro
                label="Solicitar fecha de incorporación"
                value={fechaIncorporacionSeleccionado || null}
                fetchOptions={setEstadosMotivos}
                getOptionLabel={(option) => option.label}
                onChange={(value) => setFechaIncorporacionSeleccionado(value || null)}
              />
              <AutocompleteFiltro
                label="Baja de cesión"
                value={bajaPorCesionSeleccionado || null}
                fetchOptions={setEstadosMotivos}
                getOptionLabel={(option) => option.label}
                onChange={(value) => setBajaPorCesionSeleccionado(value || null)}
              />

              <AutocompleteFiltro
                label="Afectación temporal"
                value={afectacionTemporalSeleccionado || null}
                fetchOptions={setEstadosMotivos}
                getOptionLabel={(option) => option.label}
                onChange={(value) => setAfectacionTemporalSeleccionado(value || null)}
              />

              <AutocompleteFiltro
                label="Estado"
                value={estadoSeleccionado || null}
                fetchOptions={setEstados}
                getOptionLabel={(option) => option.label}
                onChange={(value) => setEstadoSeleccionado(value || null)}
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
