import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import { Box, Button, Chip, IconButton, Paper, Popper, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { IdOption } from "@/types/microMaestros/GenericTypes";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";
import AutocompleteFiltro from "@/components/shared/AutocompleteFiltro";
import { useSearchParams } from "next/navigation";

export default function PopperFiltrosFuncionEstandarizada() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [codigoSeleccionado, setCodigoSeleccionado] = useState<string | null>(null);
  const [nombreSeleccionado, setNombreSeleccionado] = useState<string | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<IdOption | null>(null);
  const searchParams = useSearchParams();
  const { modifyQueries, removeQueries } = useQueryString();

  // Sincroniza los filtros al abrir el popup o al eliminar un filtro
  useEffect(() => {
    setCodigoSeleccionado(searchParams.get("id") || null);
    setNombreSeleccionado(searchParams.get("nombre") || null);
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

  const handleLimpiarFiltros = () => {
    setCodigoSeleccionado(null);
    setNombreSeleccionado(null);
    setEstadoSeleccionado(null);
    removeQueries(["id", "nombre", "estado"]);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleApply = () => {
    const queries: IQuery[] = [];
    codigoSeleccionado && queries.push({ name: "id", value: codigoSeleccionado });
    nombreSeleccionado && queries.push({ name: "nombre", value: nombreSeleccionado });
    estadoSeleccionado?.id &&
      queries.push({ name: "estado", value: estadoSeleccionado.id.toString() });
    modifyQueries(queries);
    handleClose();
  };

  const setEstados = async (): Promise<IdOption[]> => [
    { id: 1, label: "Activo" },
    { id: 2, label: "Inactivo" },
  ];

  return (
    <Box sx={{ flexGrow: 1, textAlign: "end" }}>
      <IconButtonPopperFilter handleClick={handleClick} open={open} />

      <Popper id={open ? "simple-popper" : undefined} open={open} anchorEl={anchorEl} placement="bottom-end">
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
            <Typography id="modal-title" variant="h6" component="h3" sx={{ fontSize: 16, fontWeight: "bold" }}>
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
            <TextField
              size="small"
              label="Código"
              value={codigoSeleccionado || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setCodigoSeleccionado(value);
                }
              }}
            />
            <TextField
              label="Nombre"
              value={nombreSeleccionado || ""}
              onChange={(e) => setNombreSeleccionado(e.target.value)}
              variant="outlined"
              size="small"
            />
            <AutocompleteFiltro
              label="Estado"
              value={estadoSeleccionado || null}
              fetchOptions={setEstados}
              getOptionLabel={(option) => option.label}
              onChange={(value) => setEstadoSeleccionado(value)}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 16 }}>
            <Button className="MuiButton-secondary" variant="contained" onClick={handleClose} sx={{ marginRight: "8px" }}>
              Cancelar
            </Button>
            <Button className="MuiButton-primary" variant="contained" onClick={handleApply}>
              Aplicar
            </Button>
          </Box>
        </Paper>
      </Popper>
    </Box>
  );
}
