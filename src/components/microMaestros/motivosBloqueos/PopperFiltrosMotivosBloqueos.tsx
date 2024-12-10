import React, { useState, useEffect } from "react";
import { Popper, Box, Paper, IconButton, Typography, Button, TextField, MenuItem } from "@mui/material";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";
import { fetchOrigenes } from "@/services/microMaestros/motivosBloqueosService";
import { MotivoBloqueoFiltradoRequest } from "@/types/microMaestros/motivosBloqueosTypes";

interface PopperFiltrosMotivosBloqueosProps {
  onApply: (filters: MotivoBloqueoFiltradoRequest) => void;
}

const PopperFiltrosMotivosBloqueos = ({ onApply }: PopperFiltrosMotivosBloqueosProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [codigoOrigen, setCodigoOrigen] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);
  const [origenes, setOrigenes] = useState<{ id: number; nombre: string }[]>([]);
  const [origenId, setOrigenId] = useState<string | null>(null);
  const [enviaNotificacion, setEnviaNotificacion] = useState<string | null>(null);
  const [enviaComunicacionFormal, setEnviaComunicacionFormal] = useState<string | null>(null);

  useEffect(() => {
    const obtenerOrigenes = async () => {
      try {
        const data = await fetchOrigenes();
        setOrigenes(data);
      } catch (error) {
        console.error("Error al cargar los orígenes:", error);
      }
    };
    obtenerOrigenes();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };

  const handleApply = () => {
    const filters: MotivoBloqueoFiltradoRequest = {};
    if (codigoOrigen) filters.codigoOrigen = codigoOrigen;
    if (nombre) filters.nombre = nombre;
    if (origenId) filters.origenId = Number(origenId);
    if (enviaNotificacion) filters.enviaNotificacion = enviaNotificacion === "true";
    if (enviaComunicacionFormal) filters.enviaComunicacionFormal = enviaComunicacionFormal === "true";

    onApply(filters);
    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setCodigoOrigen(null);
    setNombre(null);
    setOrigenId(null);
    setEnviaNotificacion(null);
    setEnviaComunicacionFormal(null);
    onApply({});
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
            padding: "16px",
            width: "400px",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Filtros
            </Typography>
            <IconButton
              onClick={handleLimpiarFiltros}
              sx={{ color: "primary.main", "&:hover": { backgroundColor: "transparent" } }}
            >
              <BackspaceOutlinedIcon sx={{ fontSize: 20 }} />
              <Typography sx={{ fontSize: 16, marginLeft: "5px", fontWeight: "semibold" }}>
                Limpiar filtros
              </Typography>
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <TextField
              label="Código"
              placeholder="Ejemplo: 001"
              value={codigoOrigen || ""}
              onChange={(e) => setCodigoOrigen(e.target.value)}
              size="small"
            />
            <TextField
              label="Nombre"
              placeholder="Ejemplo: Bloqueo parcial"
              value={nombre || ""}
              onChange={(e) => setNombre(e.target.value)}
              size="small"
            />
            <TextField
              select
              label="Origen"
              value={origenId || ""}
              onChange={(e) => setOrigenId(e.target.value)}
              size="small"
            >
              <MenuItem value="">Todos</MenuItem>
              {origenes.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.nombre}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Envia Notificación"
              value={enviaNotificacion || ""}
              onChange={(e) => setEnviaNotificacion(e.target.value)}
              size="small"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="true">Sí</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </TextField>
            <TextField
              select
              label="Envia Comunicación Formal"
              value={enviaComunicacionFormal || ""}
              onChange={(e) => setEnviaComunicacionFormal(e.target.value)}
              size="small"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="true">Sí</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </TextField>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
            <Button variant="outlined" onClick={handleClose} sx={{ marginRight: "8px" }}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleApply}>
              Aplicar
            </Button>
          </Box>
        </Paper>
      </Popper>
    </Box>
  );
};

export default PopperFiltrosMotivosBloqueos;
