import React, { useState, useEffect } from "react";
import {
  Popper,
  Box,
  Paper,
  IconButton,
  Typography,
  Button,
  TextField,
  Badge,
} from "@mui/material";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { IdOption } from "@/types/microContratos/GenericTypes";
import AutocompleteFiltro from "@/components/shared/AutocompleteFiltro";
import {
  fetchVigencia,
} from "../../../../services/microContratos/polizaSeguroService";
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";
import { fetchEstados } from "@/services/microContratos/GenericService";

export default function PopperFiltrospolizaSeguro() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  // State variables for each filter
  const [razonSocialContratistaSeleccionada, setRazonSocialContratistaSeleccionada] = useState<string | null>(null);
  const [numeroSeleccionada, setNumeroSeleccionada] = useState<string | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<IdOption | null>(null);
  const [nombreTipoSeguroSeleccionada, setNombreTipoSeguroSeleccionada] = useState<string | null>(null);
  const [nombreCompaniaAseguradoraSeleccionada, setNombreCompaniaAseguradoraSeleccionada] = useState<string | null>(null);
  const [vigenciaSeleccionada, setVigenciaSeleccionada] = useState<IdOption | null>(null);

  const { modifyQueries, removeQueries } = useQueryString();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };

  useEffect(() => {
    if (open) {
      setRazonSocialContratistaSeleccionada(null);
      setNumeroSeleccionada(null);
      setEstadoSeleccionado(null);
      setNombreTipoSeguroSeleccionada(null);
      setNombreCompaniaAseguradoraSeleccionada(null);
      setVigenciaSeleccionada(null);
    }
  }, [open]);

  const handleApply = () => {
    const queries: IQuery[] = [];
    razonSocialContratistaSeleccionada && queries.push({ name: "razonSocialContratista", value: razonSocialContratistaSeleccionada });
    numeroSeleccionada && queries.push({ name: "numero", value: numeroSeleccionada });
    estadoSeleccionado?.id && queries.push({ name: "estado", value: estadoSeleccionado.id.toString() });
    nombreTipoSeguroSeleccionada && queries.push({ name: "nombreTipoSeguro", value: nombreTipoSeguroSeleccionada });
    nombreCompaniaAseguradoraSeleccionada && queries.push({ name: "nombreCompaniaAseguradora", value: nombreCompaniaAseguradoraSeleccionada });
    vigenciaSeleccionada?.id && queries.push({ name: "vencido", value: vigenciaSeleccionada.id.toString() });
    queries.push({ name: "pageNumber", value: "1" });

    modifyQueries(queries);
    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setRazonSocialContratistaSeleccionada(null);
    setNumeroSeleccionada(null);
    setEstadoSeleccionado(null);
    setNombreTipoSeguroSeleccionada(null);
    setNombreCompaniaAseguradoraSeleccionada(null);
    setVigenciaSeleccionada(null);
    removeQueries([
      "razonSocialContratista",
      "numero",
      "estado",
      "nombreTipoSeguro",
      "nombreCompaniaAseguradora",
      "vencido",
    ]);
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
                <Typography sx={{ fontSize: 16, ml: 1.5, fontWeight: "semibold" }}>
                  Limpiar filtros
                </Typography>
              </IconButton>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
              <TextField
                size="small"
                label="Contratista"
                value={razonSocialContratistaSeleccionada || ""}
                onChange={(e) => setRazonSocialContratistaSeleccionada(e.target.value)}
              />
              <TextField
                size="small"
                label="N° de poliza"
                value={numeroSeleccionada || ""}
                onChange={(e) => setNumeroSeleccionada(e.target.value)}
              />
              <TextField
                size="small"
                label="Tipo de seguro"
                value={nombreTipoSeguroSeleccionada || ""}
                onChange={(e) => setNombreTipoSeguroSeleccionada(e.target.value)}
              />
              <TextField
                size="small"
                label="Compañía Aseguradora"
                value={nombreCompaniaAseguradoraSeleccionada || ""}
                onChange={(e) => setNombreCompaniaAseguradoraSeleccionada(e.target.value)}
              />
              <AutocompleteFiltro
                label="Vencido"
                value={vigenciaSeleccionada}
                fetchOptions={fetchVigencia}
                onChange={(value) => setVigenciaSeleccionada(value)}
              />
              <AutocompleteFiltro
                label="Estado"
                value={estadoSeleccionado}
                fetchOptions={fetchEstados}
                onChange={(value) => setEstadoSeleccionado(value)}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "16px" }}>
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
