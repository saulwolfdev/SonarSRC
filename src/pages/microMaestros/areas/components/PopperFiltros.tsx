import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import { Badge, Box, Button, Chip, IconButton, Paper, Popper, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AutocompleteFiltro from "@/components/shared/AutocompleteFiltro";
import { useRouter } from 'next/router';
import { fetchCodigo, fetchNombre } from "@/services/microMaestros/areasService";
import {ListaCodigoRequest, ListaNombreRequest } from "@/types/microMaestros/areasTypes";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";
import { useSearchParams } from "next/navigation";
import { IdOption } from "@/types/microMaestros/GenericTypes";
import { useRouterPush } from "@/hooks/useRouterPush";


interface PopperFiltrosProps {}

export default function PopperFiltros({}: PopperFiltrosProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<{ label: string; value: string }[]>([]);
  const [codigoSeleccionado, setCodigoSeleccionado] = useState<string | null>(null);
  const [nombreSeleccionado, setNombreSeleccionado] = useState<string | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<IdOption | null>(null);

  const searchParams = useSearchParams();
  const { modifyQueries, removeQueries } = useQueryString();
  const routerPush = useRouterPush();


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
      queries.push({ name: "estado", value: estadoSeleccionado.id.toString() });
    queries.push({ name: "pageNumber", value: "1" });

    modifyQueries(queries);
    setEstadoSeleccionado(null);
    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setCodigoSeleccionado(null);
    setNombreSeleccionado(null);
    setEstadoSeleccionado(null);

    removeQueries(["codigo", "nombre", "estado"]);
    setFilters([]);
    routerPush("/microMaestros/areas");
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleRemoveFilter = (label: string) => {
    console.log("Remover filtro:", label);
  };

  const fetchEstados = async (): Promise<IdOption[]> => {
    return [
      { id: 1, label: "Activo" },
      { id: 2, label: "Inactivo" },
    ];
  };

  return (
    <Box sx={{ flexGrow: 1, textAlign: "end" }}>
      <IconButtonPopperFilter handleClick={handleClick} open={open} />

      <Popper
        id={open ? "simple-popper" : undefined}
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
      >
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
            <Typography
              id="modal-title"
              variant="h6"
              component="h3"
              sx={{ fontSize: 16, fontWeight: "bold" }}
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

          <Box sx={{ display: "flex", flexDirection: "column", gap: 16, mt: 2 }}>
            <TextField
              label="Código"
              size="small"
              value={codigoSeleccionado || ""}
              onChange={(e) => setCodigoSeleccionado(e.target.value)}
            />
            <TextField
              label="Nombre"
              size="small"
              value={nombreSeleccionado || ""}
              onChange={(e) => setNombreSeleccionado(e.target.value)}
            />
            <AutocompleteFiltro
              label="Estado"
              value={estadoSeleccionado}
              fetchOptions={fetchEstados}
              getOptionLabel={(option) => option.label}
              onChange={(value) => setEstadoSeleccionado(value)}
            />
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
            {filters.map((filter) => (
              <Chip
                key={filter.label}
                label={`${filter.label}: ${filter.value}`}
                onDelete={() => handleRemoveFilter(filter.label)}
              />
            ))}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              className="MuiButton-secondary"
              variant="contained"
              onClick={handleClose}
              sx={{ marginRight: 1 }}
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
        </Paper>
      </Popper>
    </Box>
  );
}
