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
import AutocompleteFiltro from "./AutocompleteFiltro";
import {
  fetchEstados
} from "@/services/microMaestros/GenericService";
import { IdOption } from "@/types/microMaestros/GenericTypes";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";
import { useSearchParams } from "next/navigation";

export default function PopperFiltrosTipoLicenciasProlongadas() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState<string | null>(null);
  const [codigo, setCodigo] = useState<string | null>(null);
  const [tiempoLimite, setTiempoLimite] = useState<string | null>(null);
  const [observacionObligatoria, setObservacionObligatoria] =
    useState<IdOption | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<IdOption | null>(null);

  const searchParams = useSearchParams();
  const { modifyQueries, removeQueries } = useQueryString();

  // Sincroniza los filtros al abrir el popup o al eliminar un chip
  useEffect(() => {
    setCodigo(searchParams.get("codigo") || null);
    setNombre(searchParams.get("nombre") || null);
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
    nombre && queries.push({ name: "nombre", value: nombre });
    codigo && queries.push({ name: "codigo", value: codigo });
    tiempoLimite && queries.push({ name: "tiempoLimite", value: tiempoLimite });

    queries.push({ name: "pageNumber", value: "1" });
    modifyQueries(queries);
    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setNombre(null);
    setCodigo(null);
    setTiempoLimite(null);
    setObservacionObligatoria(null);
    setEstadoSeleccionado(null);
    removeQueries(["codigo", "nombre", "tiempoLimite", "observacionObligatoria", "estado"]);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const fetchObservacionObligatoria = async (): Promise<IdOption[]> => {
    return [
      { id: 1, label: "No" },
      { id: 2, label: "Si" },
    ];
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
              {/* Código */}
              <TextField
                label="Código"
                value={codigo || ""}
                onChange={(e) => setCodigo(e.target.value)}
                variant="outlined"
                size="small"
              />
              {/* Nombre */}
              <TextField
                label="Nombre"
                value={nombre || ""}
                onChange={(e) => setNombre(e.target.value)}
                variant="outlined"
                size="small"
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
