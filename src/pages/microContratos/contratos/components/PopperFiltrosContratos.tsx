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
import AutocompleteFiltro from "@/components/shared/AutocompleteFiltro";
import { ContratosFiltradoRequest } from "@/types/microContratos/contratosTypes";
import {
  fetchContratistas
} from "@/services/microContratos/ContratosService";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";
import { fetchEstados } from "@/services/microContratos/GenericService";
import { IdOption } from "@/types/microContratos/GenericTypes";

export default function PopperFiltrosContratos() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  // State variables for each filter
  const [contratistaSeleccionado, setContratistaSeleccionado] = useState<IdOption | null>(null);
  const [numeroSeleccionado, setNumeroSeleccionado] = useState<number | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<IdOption | null>(null);

  const { modifyQueries, removeQueries } = useQueryString();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };

  useEffect(() => {
    if (open) {
      setContratistaSeleccionado(null);
      setNumeroSeleccionado(null);
      setEstadoSeleccionado(null);
    }
  }, [open]);

  const handleApply = () => {
    const queries: IQuery[] = [];
    contratistaSeleccionado?.id && queries.push({ name: "contratistaId", value: contratistaSeleccionado.id.toString() });
    numeroSeleccionado !== null && queries.push({ name: "numero", value: numeroSeleccionado.toString() });
    estadoSeleccionado?.id && queries.push({ name: "estado", value: estadoSeleccionado.id.toString() });
    queries.push({ name: "pageNumber", value: "1" });

    modifyQueries(queries);
    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setContratistaSeleccionado(null);
    setNumeroSeleccionado(null);
    setEstadoSeleccionado(null);
    removeQueries(["contratistaId", "numero", "estado"]);
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

            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
              <AutocompleteFiltro
                label="Contratista"
                value={contratistaSeleccionado}
                fetchOptions={(query) =>
                  fetchContratistas(query).then((response) =>
                    response.map((c: IdOption) => ({
                      id: c.id,
                      label: c.label,
                    }))
                  )
                }
                onChange={(value) => setContratistaSeleccionado(value)}
              />
              <TextField
                label="N° de Contrato"
                value={numeroSeleccionado ?? ""}
                onChange={(event) => {
                  const value = event.target.value;
                  setNumeroSeleccionado(value === "" ? null : Number(value));
                }}
                size="small"
              />
              <AutocompleteFiltro
                label="Estado"
                value={estadoSeleccionado}
                fetchOptions={fetchEstados}
                onChange={(value) => setEstadoSeleccionado(value)}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
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
