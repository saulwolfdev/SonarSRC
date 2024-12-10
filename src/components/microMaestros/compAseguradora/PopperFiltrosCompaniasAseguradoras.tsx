import React, { useState } from "react";
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
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AutocompleteFiltro from "./AutocompleteFiltro";
import {
  fetchTipoDeSeguro,
  fetchTipoDeSeguroExceptuado,
  fetchContratista,
  fetchCompaniasAseguradoras,
} from "@/services/microMaestros/CompaniasAseguradorasService";
import {
  CompaniasAseguradorasFiltradasRequest,
} from "@/types/microMaestros/companiasAseguradorasTypes";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { IdOption } from "@/types/microMaestros/GenericTypes";
import { fetchEstados } from "@/services/microMaestros/GenericService";

export default function PopperFiltrosCompaniasAseguradoras() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [codigo, setCodigo] = useState<string>();
  const [nombre, setNombre] = useState<string>();
  const [cuit, setCuit] = useState<string>();
  const [tipoDeSeguroIdSeleccionada, setTipoDeSeguroIdSeleccionada] =
    useState<IdOption | null>(null);
  const [tipoDeSeguroExceptuadoIdSeleccionada, setTipoDeSeguroExceptuadoIdSeleccionada] =
    useState<IdOption | null>(null);
  const [contratistaIdSeleccionada, setContratistaIdSeleccionada] =
    useState<IdOption | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<{
    id: number;
    label: string;
  } | null>(null);
  const { modifyQueries, remove } = useQueryString();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };

  const handleApply = () => {
    const queries: IQuery[] = [];
    tipoDeSeguroIdSeleccionada?.id &&
      queries.push({
        name: "tipoSeguroId",
        value: tipoDeSeguroIdSeleccionada?.id.toString(),
      });
    tipoDeSeguroExceptuadoIdSeleccionada?.id &&
      queries.push({
        name: "tipoSeguroExceptuadoId",
        value: tipoDeSeguroExceptuadoIdSeleccionada?.id.toString(),
      });
    contratistaIdSeleccionada?.id &&
      queries.push({
        name: "contratistaId",
        value: contratistaIdSeleccionada?.id.toString(),
      });
    estadoSeleccionado?.id &&
      queries.push({
        name: "estado",
        value: estadoSeleccionado?.id.toString(),
      });
    nombre && queries.push({ name: "nombre", value: nombre });
    codigo && queries.push({ name: "codigo", value: codigo });
    cuit && queries.push({ name: "cuit", value: cuit });
    queries.push({ name: "pageNumber", value: "1" });

    modifyQueries(queries);
    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setNombre("");
    setCodigo("");
    setCuit("");
    setContratistaIdSeleccionada(null);
    setTipoDeSeguroIdSeleccionada(null);
    setTipoDeSeguroExceptuadoIdSeleccionada(null);
    setEstadoSeleccionado(null);
    remove();
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  return (
    <Box>
      <IconButton onClick={handleClick}>
        <Badge>
          <FilterAltIcon />
        </Badge>
      </IconButton>
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
              {/* Código */}
              <TextField
                label={"Código"}
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                variant="outlined"
                size="small"
              />
              {/* Nombre */}
              <TextField
                label={"Nombre"}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                variant="outlined"
                size="small"
              />
              {/* CUIT */}
              <TextField
                label={"CUIT"}
                value={cuit}
                onChange={(e) => setCuit(e.target.value)}
                variant="outlined"
                size="small"
              />

              {/* Tipo de seguro */}
              <AutocompleteFiltro
                label="Tipo de seguro"
                value={tipoDeSeguroIdSeleccionada}
                fetchOptions={fetchTipoDeSeguro}
                onChange={(value) => setTipoDeSeguroIdSeleccionada(value)}
              />

              {/* Tipo de seguro exceptuado */}
              <AutocompleteFiltro
                label="Tipo de seguro exceptuado"
                value={tipoDeSeguroExceptuadoIdSeleccionada}
                fetchOptions={fetchTipoDeSeguroExceptuado}
                onChange={(value) => setTipoDeSeguroExceptuadoIdSeleccionada(value)}
              />
              {/* Contratista */}
              <AutocompleteFiltro
                label="Contratista"
                value={contratistaIdSeleccionada}
                fetchOptions={fetchContratista}
                onChange={(value) => setContratistaIdSeleccionada(value)}
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
