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
import AutocompleteFiltro from "../../../pages/microMaestros/grupoArticulos/components/AutocompleteFiltro";
import { fetchIncidencia } from "../../../services/microMaestros/grupoArticulosService";
import { IdOption } from "@/types/microMaestros/GenericTypes";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { useSearchParams } from "next/navigation";
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";

export default function PopperFiltrosGrupoArticulos() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [grupoArticulo, setGrupoArticulo] = useState<string | null>(null);
  const [descripcion, setDescripcion] = useState<string | null>(null);
  const [incidencia, setIncidencia] = useState<IdOption | null>(null);

  const searchParams = useSearchParams();
  const { modifyQueries, removeQueries } = useQueryString();

  // Sincroniza el estado de los filtros al abrir el popup o al eliminar un filtro
  useEffect(() => {
    setGrupoArticulo(searchParams.get("grupoArticulo") || null);
    setDescripcion(searchParams.get("descripcion") || null);
    setIncidencia(
      searchParams.get("incidenciaId")
        ? { id: parseInt(searchParams.get("incidenciaId") as string), label: "" }
        : null
    );
  }, [searchParams.toString(), open]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };

  const handleApply = () => {
    const queries: IQuery[] = [];
    grupoArticulo && queries.push({ name: "grupoArticulo", value: grupoArticulo });
    descripcion && queries.push({ name: "descripcion", value: descripcion });
    incidencia?.id &&
      queries.push({
        name: "incidenciaId",
        value: incidencia.id.toString(),
      });

    modifyQueries(queries);
    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setGrupoArticulo(null);
    setDescripcion(null);
    setIncidencia(null);
    removeQueries(["grupoArticulo", "descripcion", "incidenciaId"]);
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
                label="Grupo de artículo"
                value={grupoArticulo || ""}
                onChange={(e) => setGrupoArticulo(e.target.value)}
                variant="outlined"
                size="small"
              />
              <TextField
                label="Descripción"
                value={descripcion || ""}
                onChange={(e) => setDescripcion(e.target.value)}
                variant="outlined"
                size="small"
              />
              <AutocompleteFiltro
                label="Incidencia"
                value={incidencia}
                fetchOptions={fetchIncidencia}
                onChange={(value) => setIncidencia(value)}
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
