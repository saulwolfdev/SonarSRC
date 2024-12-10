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

import AutocompleteFiltro from "@/components/shared/AutocompleteFiltro";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";
import { useSearchParams } from "next/navigation"; // Hook para monitorear los parámetros de búsqueda
import {
  fetchObjecion,
  fetchRechazo,
} from "@/services/microMaestros/motivosRechazoAfectacionService";
import { fetchEstados } from "@/services/microMaestros/GenericService";

export default function PopperFiltrosMotivosRechazoObjecionAfectacion() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [nombreSeleccionado, setNombreSeleccionado] = useState<string | null>(
    null
  );
  const [codigoSeleccionado, setCodigoSeleccionado] = useState<string | null>(
    null
  );
  const [objecionSeleccionada, setObjecionSeleccionada] = useState<{
    id: number;
    label: string;
  } | null>(null);
  const [rechazoSeleccionado, setRechazoSeleccionado] = useState<{
    id: number;
    label: string;
  } | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<{
    id: number;
    label: string;
  } | null>(null);

  const searchParams = useSearchParams(); // Hook para acceder a los parámetros de búsqueda
  const { modifyQueries, removeQueries } = useQueryString();

  // Sincroniza los estados de los filtros con los valores en `searchParams` cuando se abren los filtros
  useEffect(() => {
    setNombreSeleccionado(searchParams.get("nombre") || "");
    setCodigoSeleccionado(searchParams.get("codigo") || "");
    setObjecionSeleccionada(
      searchParams.get("objecion")
        ? { id: Number(searchParams.get("objecion")), label: "" }
        : null
    );
    setRechazoSeleccionado(
      searchParams.get("rechazo")
        ? { id: Number(searchParams.get("rechazo")), label: "" }
        : null
    );
    setEstadoSeleccionado(
      searchParams.get("estado")
        ? { id: Number(searchParams.get("estado")), label: "" }
        : null
    );
  }, [searchParams.toString(), open]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };

  const handleApply = () => {
    const queries: IQuery[] = [];
    objecionSeleccionada?.id &&
      queries.push({
        name: "objecion",
        value: objecionSeleccionada.id.toString(),
      });
    rechazoSeleccionado?.id &&
      queries.push({
        name: "rechazo",
        value: rechazoSeleccionado.id.toString(),
      });
    estadoSeleccionado?.id &&
      queries.push({
        name: "estado",
        value: estadoSeleccionado.id.toString(),
      });
    nombreSeleccionado &&
      queries.push({ name: "nombre", value: nombreSeleccionado });
    codigoSeleccionado &&
      queries.push({ name: "codigo", value: codigoSeleccionado });
    queries.push({ name: "pageNumber", value: "1" });

    modifyQueries(queries);
    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setNombreSeleccionado(null);
    setObjecionSeleccionada(null);
    setRechazoSeleccionado(null);
    setEstadoSeleccionado(null);
    setCodigoSeleccionado(null);
    removeQueries(["objecion", "rechazo", "estado", "nombre", "codigo"]);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
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
                <Typography
                  sx={{ fontSize: 16, ml: 5, fontWeight: "semibold" }}
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
                label={"Código"}
                value={codigoSeleccionado}
                onChange={(e) => setCodigoSeleccionado(e.target.value)}
                variant="outlined"
                size="small"
              />
              <TextField
                label={"Nombre"}
                value={nombreSeleccionado}
                onChange={(e) => setNombreSeleccionado(e.target.value)}
                variant="outlined"
                size="small"
              />

              <AutocompleteFiltro
                label="Objeción"
                value={objecionSeleccionada}
                fetchOptions={fetchObjecion}
                onChange={(value) => setObjecionSeleccionada(value)}
              />

              <AutocompleteFiltro
                label="Rechazo"
                value={rechazoSeleccionado}
                fetchOptions={fetchRechazo}
                onChange={(value) => setRechazoSeleccionado(value)}
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
