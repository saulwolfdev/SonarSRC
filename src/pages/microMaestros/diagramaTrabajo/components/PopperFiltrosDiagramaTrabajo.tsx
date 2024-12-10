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
import { IdOption } from "@/types/microMaestros/GenericTypes";
import { setEstados } from "../services/DiagramaTrabajoService";
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";
import { useSearchParams } from "next/navigation";

export default function PopperFiltrosDiagramaTrabajo() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [diagramaTrabajoSeleccionado, setDiagramaTrabajoSeleccionado] = useState<string | null>(null);
  const [diasTrabajo, setDiasTrabajo] = useState<string | null>(null);
  const [diasDescanso, setDiasDescanso] = useState<string | null>(null);
  const [diasTrabajoMes, setDiasTrabajoMes] = useState<string | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<IdOption | null>(null);

  const searchParams = useSearchParams();
  const { modifyQueries, removeQueries } = useQueryString();

  // Sincroniza los filtros al abrir el popup o al eliminar un filtro
  useEffect(() => {
    setDiagramaTrabajoSeleccionado(searchParams.get("id") || null);
    setDiasTrabajo(searchParams.get("diasTrabajo") || null);
    setDiasDescanso(searchParams.get("diasDescanso") || null);
    setDiasTrabajoMes(searchParams.get("diasTrabajoMes") || null);
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
    diagramaTrabajoSeleccionado && queries.push({ name: "id", value: diagramaTrabajoSeleccionado });
    diasTrabajo && queries.push({ name: "diasTrabajo", value: diasTrabajo });
    diasDescanso && queries.push({ name: "diasDescanso", value: diasDescanso });
    diasTrabajoMes && queries.push({ name: "diasTrabajoMes", value: diasTrabajoMes });
    estadoSeleccionado?.id && queries.push({ name: "estado", value: estadoSeleccionado.id.toString() });

    modifyQueries(queries);
    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setDiagramaTrabajoSeleccionado(null);
    setDiasTrabajo(null);
    setDiasDescanso(null);
    setDiasTrabajoMes(null);
    setEstadoSeleccionado(null);
    removeQueries(["id", "diasTrabajo", "diasDescanso", "diasTrabajoMes", "estado"]);
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
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography id="modal-title" variant="body1" sx={{ fontWeight: "bold" }}>Filtros</Typography>
              <IconButton
                onClick={handleLimpiarFiltros}
                sx={{
                  color: "primary.main",
                  textAlign: "right",
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                <BackspaceOutlinedIcon sx={{ fontSize: 20 }} />
                <Typography sx={{ fontSize: 16, ml: 1.5, fontWeight: "semibold" }}>Limpiar filtros</Typography>
              </IconButton>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
              <TextField
                label="Código"
                size="small"
                value={diagramaTrabajoSeleccionado || ""}
                onChange={(event) => setDiagramaTrabajoSeleccionado(event.target.value || null)}
              />
              <TextField
                label="Días de trabajo"
                size="small"
                value={diasTrabajo || ""}
                onChange={(event) => setDiasTrabajo(event.target.value || null)}
              />
              <TextField
                label="Días de descanso"
                size="small"
                value={diasDescanso || ""}
                onChange={(event) => setDiasDescanso(event.target.value || null)}
              />
              <TextField
                label="Días de trabajo por mes"
                size="small"
                value={diasTrabajoMes || ""}
                onChange={(event) => setDiasTrabajoMes(event.target.value || null)}
              />
              <AutocompleteFiltro
                label="Estado"
                value={estadoSeleccionado || null}
                fetchOptions={setEstados}
                getOptionLabel={(option) => option.label}
                onChange={(value) => setEstadoSeleccionado(value)}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
              <Button variant="contained" color="primary" onClick={handleApply}>Aplicar</Button>
            </Box>
          </Box>
        </Paper>
      </Popper>
    </Box>
  );
}
