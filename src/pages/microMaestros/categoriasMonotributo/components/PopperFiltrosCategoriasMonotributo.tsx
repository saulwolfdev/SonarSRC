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
import { setEstados } from "../services/CategoriasMonotributoService";
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";
import { useSearchParams } from "next/navigation";

export default function PopperFiltrosCategoriasMonotributo() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [codigoMonotributoSeleccionado, setCodigoMonotributoSeleccionado] = useState<number | null>(null);
  const [nombreMonotributoSeleccionado, setNombreMonotributoSeleccionado] = useState<string | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<IdOption | null>(null);

  const searchParams = useSearchParams();
  const { modifyQueries, removeQueries } = useQueryString();

  // Sincronización de filtros al abrir el popup o al limpiar los filtros
  useEffect(() => {
    setCodigoMonotributoSeleccionado(
      searchParams.get("id") ? parseInt(searchParams.get("id") as string, 10) : null
    );
    setNombreMonotributoSeleccionado(searchParams.get("nombre") || "");
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
    codigoMonotributoSeleccionado &&
      queries.push({ name: "id", value: codigoMonotributoSeleccionado.toString() });
    nombreMonotributoSeleccionado &&
      queries.push({ name: "nombre", value: nombreMonotributoSeleccionado });
    estadoSeleccionado?.id &&
      queries.push({ name: "estado", value: estadoSeleccionado.id.toString() });

    modifyQueries(queries);
    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setCodigoMonotributoSeleccionado(null);
    setNombreMonotributoSeleccionado(null);
    setEstadoSeleccionado(null);
    removeQueries(["id", "nombre", "estado"]);
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
                value={
                  codigoMonotributoSeleccionado !== null
                    ? codigoMonotributoSeleccionado
                    : ""
                }
                onChange={(event) => {
                  const value = event.target.value;
                  setCodigoMonotributoSeleccionado(value ? parseInt(value, 10) : null);
                }}
              />
              <TextField
                label="Nombre"
                size="small"
                value={nombreMonotributoSeleccionado || ""}
                onChange={(event) => setNombreMonotributoSeleccionado(event.target.value)}
              />
              <AutocompleteFiltro
                label="Estado diagrama trabajo"
                value={estadoSeleccionado}
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
