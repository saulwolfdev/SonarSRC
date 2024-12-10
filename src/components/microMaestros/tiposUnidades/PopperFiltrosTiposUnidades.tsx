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
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";
import { useSearchParams } from "next/navigation";

export default function PopperFiltrosTiposUnidades() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [codigoSeleccionado, setCodigoSeleccionado] = useState<string | null>(null);
  const [nombreSeleccionado, setNombreSeleccionado] = useState<string | null>(null);
  const [tipoRecursoSeleccionado, setTipoRecursoSeleccionado] = useState<string | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<boolean | null>(null);

  const searchParams = useSearchParams();
  const { modifyQueries, removeQueries } = useQueryString();

  // Sincroniza los filtros al abrir el popup o al eliminar un filtro
  useEffect(() => {
    setCodigoSeleccionado(searchParams.get("codigo") || "");
    setNombreSeleccionado(searchParams.get("nombre") || "");
    setTipoRecursoSeleccionado(searchParams.get("tipoRecurso") || "");
    setEstadoSeleccionado(
      searchParams.get("estado") !== null
        ? searchParams.get("estado") === "1"
        : null
    );
  }, [searchParams.toString(), open]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };

  const handleApply = () => {
    const queries: IQuery[] = [];
    codigoSeleccionado && queries.push({ name: "codigo", value: codigoSeleccionado });
    nombreSeleccionado && queries.push({ name: "nombre", value: nombreSeleccionado });
    tipoRecursoSeleccionado && queries.push({ name: "tipoRecurso", value: tipoRecursoSeleccionado });
    estadoSeleccionado !== null &&
      queries.push({
        name: "estado",
        value: estadoSeleccionado ? "1" : "0",
      });

    modifyQueries(queries);
    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setCodigoSeleccionado(null);
    setNombreSeleccionado(null);
    setTipoRecursoSeleccionado(null);
    setEstadoSeleccionado(null);
    removeQueries(["codigo", "nombre", "tipoRecurso", "estado"]);
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
              <Typography id="modal-title" variant="body1" sx={{ fontWeight: "bold" }}>
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
                value={codigoSeleccionado || ""}
                onChange={(event) => setCodigoSeleccionado(event.target.value)}
                size="small"
              />
              <TextField
                label="Nombre"
                value={nombreSeleccionado || ""}
                onChange={(event) => setNombreSeleccionado(event.target.value)}
                size="small"
              />
              <TextField
                label="Tipo de Recurso"
                value={tipoRecursoSeleccionado || ""}
                onChange={(event) => setTipoRecursoSeleccionado(event.target.value)}
                size="small"
              />
              <TextField
                label="Estado"
                SelectProps={{
                  native: true,
                }}
                value={estadoSeleccionado !== null ? (estadoSeleccionado ? "1" : "0") : ""}
                onChange={(event) =>
                  setEstadoSeleccionado(event.target.value === "1" ? true : false)
                }
                size="small"
              >
                <option value=""></option>
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </TextField>
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
              <Button className="MuiButton-primary" variant="contained" onClick={handleApply}>
                Aplicar
              </Button>
            </Box>
          </Box>
        </Paper>
      </Popper>
    </Box>
  );
}
