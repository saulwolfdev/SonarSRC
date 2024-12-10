import React, { useState, useEffect } from "react";
import {
  Popper,
  Box,
  Paper,
  IconButton,
  Typography,
  Button,
  TextField,
  Divider,
  Badge,
} from "@mui/material";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import AutocompleteFiltro from "../../../pages/microMaestros/puestosEmpresa/components/AutocompleteFiltro";
import { EstadoOption } from "@/types/microMaestros/puestosEmpresaTypes";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { fetchEstados } from "@/services/microMaestros/GenericService";
import { useSearchParams } from "next/navigation";
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";
import { IdOption } from "@/types/microContratos/GenericTypes";

export default function PopperFiltrosPuestosEmpresa() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [nombreSeleccionado, setNombreSeleccionado] = useState<string | null>(null);
  const [codigoAfipSeleccionado, setCodigoAfipSeleccionado] = useState<string | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<IdOption | null>(null);

  const searchParams = useSearchParams();
  const { modifyQueries, removeQueries } = useQueryString();

  useEffect(() => {
    setNombreSeleccionado(searchParams.get("nombre") || null);
    setCodigoAfipSeleccionado(searchParams.get("codigoAfip") || null);
    setEstadoSeleccionado(
      searchParams.get("estado")
        ? { id: Number(searchParams.get("estado")), label: "" }
        : null
    );
  }, [searchParams.toString(), open]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };

  const handleApply = () => {
    const queries: IQuery[] = [];
    nombreSeleccionado && queries.push({ name: "nombre", value: nombreSeleccionado });
    codigoAfipSeleccionado && queries.push({ name: "codigoAfip", value: codigoAfipSeleccionado });
    estadoSeleccionado?.id &&
      queries.push({ name: "estado", value: estadoSeleccionado.id.toString() });

    modifyQueries(queries);
    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setNombreSeleccionado(null);
    setCodigoAfipSeleccionado(null);
    setEstadoSeleccionado(null);
    removeQueries(["nombre", "codigoAfip", "estado"]);
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
            borderRadius: "20px",
            background: "#FFFFFF",
            boxShadow: "4px 4px 10px #D6D6D6",
            border: "0.5px solid #7070701A",
            opacity: 1,
          }}
        >
          <Box sx={{ width: "400px" }}>
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
                sx={{ fontWeight: "bold", paddingLeft: 38, paddingTop: 38 }}
              >
                Filtros
              </Typography>
              <IconButton
                onClick={handleLimpiarFiltros}
                sx={{
                  color: "primary.main",
                  textAlign: "right",
                  paddingTop: 38,
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                <BackspaceOutlinedIcon sx={{ fontSize: 20 }} />
                <Typography sx={{ fontSize: 16, ml: 5, fontWeight: "semibold", paddingRight: 38 }}>
                  Limpiar filtros
                </Typography>
              </IconButton>
            </Box>

            <Divider sx={{ backgroundColor: "#D6D6D68A", marginY: "16px", width: "100%" }} />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                paddingInline: 38,
              }}
            >
              <TextField
                label="Nombre"
                value={nombreSeleccionado || ""}
                onChange={(event) => setNombreSeleccionado(event.target.value)}
                size="small"
              />
              <TextField
                label="Código AFIP"
                value={codigoAfipSeleccionado || ""}
                onChange={(event) => setCodigoAfipSeleccionado(event.target.value)}
                size="small"
              />
              <AutocompleteFiltro
                label="Estado"
                value={estadoSeleccionado}
                fetchOptions={fetchEstados}
                getOptionLabel={(option) => option.label}
                onChange={(value) => setEstadoSeleccionado(value)}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
                paddingRight: 38,
                paddingBottom: 38,
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
