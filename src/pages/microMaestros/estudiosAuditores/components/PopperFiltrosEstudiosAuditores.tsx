"use client";
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
import { setEstados } from "@/services/microMaestros/EstudioAuditoresService";
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";
import { useSearchParams } from "next/navigation";

export default function PopperFiltrosEstudiosAuditores() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [estudioAuditorSeleccionado, setEstudioAuditorSeleccionado] = useState<string | null>(null);
  const [nombreEstudioSeleccionado, setNombreEstudioSeleccionado] = useState<string | null>(null);
  const [cuitEstudioSeleccionado, setCuitEstudioSeleccionado] = useState<string | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<IdOption | null>(null);
  const [nombreSedeEstudioSeleccionado, setNombreSedeEstudioSeleccionado] = useState<string | null>(null);
  const [nombreReferenteEstudioSeleccionado, setNombreReferenteEstudioSeleccionado] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const { modifyQueries, removeQueries } = useQueryString();

  // Sincroniza los filtros al abrir el popup o al eliminar un filtro
  useEffect(() => {
    setEstudioAuditorSeleccionado(searchParams.get("id") || null);
    setNombreEstudioSeleccionado(searchParams.get("nombre") || null);
    setCuitEstudioSeleccionado(searchParams.get("cuit") || null);
    setEstadoSeleccionado(
      searchParams.get("estado")
        ? { id: parseInt(searchParams.get("estado") as string), label: "" }
        : null
    );
    setNombreSedeEstudioSeleccionado(searchParams.get("nombreSede") || null);
    setNombreReferenteEstudioSeleccionado(searchParams.get("estadoReferente") || null);
  }, [searchParams.toString(), open]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };

  const handleApply = () => {
    const queries: IQuery[] = [];
    estudioAuditorSeleccionado && queries.push({ name: "id", value: estudioAuditorSeleccionado });
    nombreEstudioSeleccionado && queries.push({ name: "nombre", value: nombreEstudioSeleccionado });
    cuitEstudioSeleccionado && queries.push({ name: "cuit", value: cuitEstudioSeleccionado });
    estadoSeleccionado?.id && queries.push({ name: "estado", value: estadoSeleccionado.id.toString() });
    nombreSedeEstudioSeleccionado && queries.push({ name: "nombreSede", value: nombreSedeEstudioSeleccionado });
    nombreReferenteEstudioSeleccionado && queries.push({ name: "estadoReferente", value: nombreReferenteEstudioSeleccionado });

    modifyQueries(queries);
    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setEstudioAuditorSeleccionado(null);
    setNombreEstudioSeleccionado(null);
    setEstadoSeleccionado(null);
    setCuitEstudioSeleccionado(null);
    setNombreSedeEstudioSeleccionado(null);
    setNombreReferenteEstudioSeleccionado(null);
    removeQueries(["id", "nombre", "cuit", "estado", "nombreSede", "estadoReferente"]);
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
                label="Código estudio auditor"
                size="small"
                value={estudioAuditorSeleccionado || ""}
                onChange={(event) => setEstudioAuditorSeleccionado(event.target.value || null)}
              />
              <TextField
                label="Nombre estudio auditor"
                size="small"
                value={nombreEstudioSeleccionado || ""}
                onChange={(event) => setNombreEstudioSeleccionado(event.target.value || null)}
              />
              <TextField
                label="CUIT estudio auditor"
                size="small"
                value={cuitEstudioSeleccionado || ""}
                onChange={(event) => setCuitEstudioSeleccionado(event.target.value || null)}
              />
              <AutocompleteFiltro
                label="Estado estudio auditor"
                value={estadoSeleccionado}
                fetchOptions={setEstados}
                getOptionLabel={(option) => option.label}
                onChange={(value) => setEstadoSeleccionado(value)}
              />
              <TextField
                label="Nombre sede"
                size="small"
                value={nombreSedeEstudioSeleccionado || ""}
                onChange={(event) => setNombreSedeEstudioSeleccionado(event.target.value || null)}
              />
              <TextField
                label="Nombre referente"
                size="small"
                value={nombreReferenteEstudioSeleccionado || ""}
                onChange={(event) => setNombreReferenteEstudioSeleccionado(event.target.value || null)}
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
