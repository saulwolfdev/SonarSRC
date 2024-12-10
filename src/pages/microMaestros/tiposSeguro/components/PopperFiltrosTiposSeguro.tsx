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
import { fetchEstados } from "@/services/microMaestros/GenericService";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { IdOption } from "@/types/microMaestros/GenericTypes";
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";
import AutocompleteFiltro from "@/components/shared/AutocompleteFiltro";
import { useSearchParams } from "next/navigation";

export default function PopperFiltrosTiposSeguro() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [codigoSeleccionado, setCodigoSeleccionado] = useState<string | null>(null);
  const [nombreSeleccionado, setNombreSeleccionado] = useState<string | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<IdOption | null>(null);

  const searchParams = useSearchParams();
  const { modifyQueries, removeQueries } = useQueryString();

  // Sincroniza los filtros al abrir el popup o al eliminar un chip
  useEffect(() => {
    setCodigoSeleccionado(searchParams.get("codigo") || null);
    setNombreSeleccionado(searchParams.get("nombre") || null);
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
    codigoSeleccionado && queries.push({ name: "codigo", value: codigoSeleccionado });
    nombreSeleccionado && queries.push({ name: "nombre", value: nombreSeleccionado });
    estadoSeleccionado?.id &&
      queries.push({
        name: "estado",
        value: estadoSeleccionado.id.toString(),
      });

    modifyQueries(queries);
    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setCodigoSeleccionado(null);
    setNombreSeleccionado(null);
    setEstadoSeleccionado(null);
    removeQueries(["codigo", "nombre", "estado"]);
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
              <AutocompleteFiltro
                label="Estado"
                value={estadoSeleccionado || null}
                fetchOptions={fetchEstados}
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
