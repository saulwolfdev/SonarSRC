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
  fetchEstados,
} from "../../../../services/microMaestros/cursosService";
import { IdOption } from "../../../../types/microMaestros/cursosTypes";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";
import { useSearchParams } from "next/navigation";

export default function PopperFiltrosCursos() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState<string | null>(null);
  const [codigo, setCodigo] = useState<string | null>(null);
  const [especialidad, setEspecialidad] = useState<string | null>(null);
  const [institucion, setInstitucion] = useState<string | null>(null);
  const [modalidad, setModalidad] = useState<string | null>(null);
  const [areaSolicitante, setAreaSolicitante] = useState<string | null>(null);
  const [horas, setHoras] = useState<string | null>(null);


    useState<IdOption | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<IdOption | null>(null);

  const searchParams = useSearchParams();
  const { modifyQueries, removeQueries } = useQueryString();

  // Sincroniza los filtros al abrir el popup o al eliminar un chip
  useEffect(() => {
    setCodigo(searchParams.get("codigo") || null);
    setEspecialidad(searchParams.get("especialidad") || null);
    setInstitucion(searchParams.get("institucion") || null);
    setModalidad(searchParams.get("modalidad") || null);
    setAreaSolicitante(searchParams.get("areaSolicitante") || null);
    setHoras(searchParams.get("horas") || null);

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
    estadoSeleccionado?.id &&
      queries.push({
        name: "estado",
        value: estadoSeleccionado.id.toString(),
      });
    nombre && queries.push({ name: "nombre", value: nombre });
    especialidad && queries.push({ name: "especialidad", value: especialidad });
    institucion && queries.push({ name: "institucion", value: institucion });
    modalidad && queries.push({ name: "modalidad", value: modalidad });
    areaSolicitante && queries.push({ name: "areaSolicitante", value: areaSolicitante });
    horas && queries.push({ name: "horas", value: horas });
    codigo && queries.push({ name: "codigo", value: codigo });

    queries.push({ name: "pageNumber", value: "1" });
    modifyQueries(queries);
    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setNombre(null);
    setCodigo(null);
    setEspecialidad(null);
    setInstitucion(null);
    setModalidad(null);
    setAreaSolicitante(null);
    setHoras(null);
    setEstadoSeleccionado(null);
    removeQueries(["codigo", "nombre", "especialidad", "institucion", "modalidad", "areaSolicitante", "horas", "estado"]);
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
              {/* Codigo */}
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

              {/* Institución */}
              <TextField
                label="Institución"
                value={institucion || ""}
                onChange={(e) => setInstitucion(e.target.value)}
                variant="outlined"
                size="small"
              />
              {/* Modalidad */}
              <TextField
                label="Modalidad"
                value={modalidad || ""}
                onChange={(e) => setModalidad(e.target.value)}
                variant="outlined"
                size="small"
              />
              {/* Área solicitante */}
              <TextField
                label="Área solicitante"
                value={areaSolicitante || ""}
                onChange={(e) => setAreaSolicitante(e.target.value)}
                variant="outlined"
                size="small"
              />
              {/* Horas */}
              <TextField
                label="Horas"
                value={horas || ""}
                onChange={(e) => setHoras(e.target.value)}
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
