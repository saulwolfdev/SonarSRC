import React, { useState, useEffect } from "react";
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
import AutocompleteFiltro from "../../../pages/microMaestros/motivoDelegacion/components/AutocompleteFiltro";
import {
  fetchEstados
} from "@/services/microMaestros/GenericService";
import {
  IdOption,
} from "@/types/microMaestros/GenericTypes";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { useSearchParams } from "next/navigation";
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";

export default function PopperFiltrosMotivoDelegacion() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [nombreMotivo, setNombreMotivo] = useState<string | null>(null);
  const [codigo, setCodigo] = useState<string | null>(null);
  const [tiempoLimite, setTiempoLimite] = useState<string | null>(null);
  const [observacionObligatoria, setObservacionObligatoria] = useState<IdOption | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<IdOption | null>(null);

  const searchParams = useSearchParams();
  const { modifyQueries, removeQueries } = useQueryString();

  // Sincroniza el estado con los filtros actuales al abrir el popup o eliminar un filtro
  useEffect(() => {
    setNombreMotivo(searchParams.get("nombreMotivo") || null);
    setCodigo(searchParams.get("codigo") || null);
    setTiempoLimite(searchParams.get("tiempoLimite") || null);
    setObservacionObligatoria(
      searchParams.get("observacionObligatoria")
        ? { id: parseInt(searchParams.get("observacionObligatoria") as string), label: "" }
        : null
    );
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
    observacionObligatoria?.id &&
      queries.push({
        name: "observacionObligatoria",
        value: observacionObligatoria.id.toString(),
      });
    estadoSeleccionado?.id &&
      queries.push({
        name: "estado",
        value: estadoSeleccionado.id.toString(),
      });
    nombreMotivo && queries.push({ name: "nombreMotivo", value: nombreMotivo });
    codigo && queries.push({ name: "codigo", value: codigo });
    tiempoLimite && queries.push({ name: "tiempoLimite", value: tiempoLimite });

    modifyQueries(queries);
    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setNombreMotivo(null);
    setCodigo(null);
    setTiempoLimite(null);
    setObservacionObligatoria(null);
    setEstadoSeleccionado(null);
    removeQueries(["nombreMotivo", "codigo", "tiempoLimite", "observacionObligatoria", "estado"]);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const fetchObservacionObligatoria = async (): Promise<IdOption[]> => {
    return [{ id: 1, label: 'No' }, { id: 2, label: 'Si' }];
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
            borderRadius: "20px",
            opacity: 1,
          }}
        >
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
                <Typography sx={{ fontSize: 16, ml: 1.5, fontWeight: "semibold" }}>
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
                value={codigo || ""}
                onChange={(e) => setCodigo(e.target.value)}
                variant="outlined"
                size="small"
              />
              <TextField
                label="Nombre"
                value={nombreMotivo || ""}
                onChange={(e) => setNombreMotivo(e.target.value)}
                variant="outlined"
                size="small"
              />
              <TextField
                label="Tiempo límite"
                value={tiempoLimite || ""}
                type="number"
                onChange={(e) => setTiempoLimite(e.target.value)}
                variant="outlined"
                size="small"
              />
              <AutocompleteFiltro
                label="Observación obligatoria"
                value={observacionObligatoria}
                fetchOptions={fetchObservacionObligatoria}
                onChange={(value) => setObservacionObligatoria(value)}
              />
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
