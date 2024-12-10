import React, { useState, useEffect } from "react";
import {
  Popper,
  Box,
  Paper,
  IconButton,
  Typography,
  Button,
  TextField,
  styled,
} from "@mui/material";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import AutocompleteFiltro from "@/components/shared/AutocompleteFiltro";
import { IdOption } from "@/types/microContratos/GenericTypes";
import { fetchEstadosBloqueosFiltos, fetchEstadosContratistas, fetchOrigen } from "@/services/microContratos/contratistasService";
import useQueryString, { IQuery } from "@/hooks/useQueryString";
import { ListaPaisesRequest } from "@/types/microMaestros/ubicacionGeograficaTypes";
import { fetchPaises } from "@/services/microMaestros/ubicacionGeograficaService";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PickerValidDate } from "@mui/x-date-pickers/models";
import LocalizationProviderCustom from "@/components/shared/LocalizationProviderCustom";
import IconButtonPopperFilter from "@/components/shared/IconButtonPopperFilter";

export default function PopperFiltrosContratistas() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [razonSocial, setRazonSocial] = useState<string | null>(null);
  const [numeroIdentificacion, setNumeroIdentificacion] = useState<number | null>(null);
  const [fechaCreacion, setFechaCreacion] = useState<PickerValidDate | null>(null);
  const [emailComercial, setEmailComercial] = useState<string | null>(null);
  const [pais, setPais] = useState<IdOption | null>(null);
  const [origen, setOrigen] = useState<IdOption | null>(null);
  const [estado, setEstado] = useState<IdOption | null>(null);
  const [bloqueo, setBloqueo] = useState<IdOption | null>(null);
  
  const { modifyQueries, removeQueries } = useQueryString();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen(!open);
  };

  // Reset filters when popper is reopened
  useEffect(() => {
    if (open) {
      setRazonSocial(null);
      setNumeroIdentificacion(null);
      setFechaCreacion(null);
      setEmailComercial(null);
      setPais(null);
      setOrigen(null);
      setEstado(null);
      setBloqueo(null);
    }
  }, [open]);

  const handleApply = () => {
    const queries: IQuery[] = [];
    razonSocial && queries.push({ name: "razonSocial", value: razonSocial });
    numeroIdentificacion && queries.push({ name: "numeroIdentificacion", value: numeroIdentificacion.toString() });
    fechaCreacion && queries.push({ name: "fechaCreacion", value: fechaCreacion.toString() });
    emailComercial && queries.push({ name: "emailContactoComercial", value: emailComercial });
    pais?.id && queries.push({ name: "pais", value: pais.id.toString() });
    origen?.id && queries.push({ name: "origenId", value: origen.id.toString() });
    estado?.id && queries.push({ name: "estado", value: estado.id.toString(), });
    bloqueo?.id && queries.push({ name: "estadoBloqueoId", value: bloqueo.id.toString() });
    queries.push({ name: "pageNumber", value: "1" });
    modifyQueries(queries);
    handleClose();
  };

  const handleLimpiarFiltros = () => {
    setRazonSocial(null);
    setNumeroIdentificacion(null);
    setFechaCreacion(null);
    setEmailComercial(null);
    setPais(null);
    setOrigen(null);
    setEstado(null);
    setBloqueo(null);
    removeQueries(["razonSocial", "numeroIdentificacion", "fechaCreacion", "emailContactoComercial", "pais", "origenId", "estado", "estadoBloqueoId"]);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const buscarPaises = async (busqueda?: string): Promise<IdOption[]> => {
    const filtros: ListaPaisesRequest = { nombre: busqueda };
    const listaPaises = await fetchPaises(filtros);
    return listaPaises.data.map((p) => ({ id: p.id, label: p.nombre }));
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
          <Box sx={{ padding: "16px", width: "700px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography id="modal-title" variant="body1" sx={{ fontWeight: "bold" }}>
                Filtros
              </Typography>
              <IconButton onClick={handleLimpiarFiltros} sx={{ color: "primary.main", "&:hover": { backgroundColor: "transparent" } }}>
                <BackspaceOutlinedIcon sx={{ fontSize: 20 }} />
                <Typography sx={{ fontSize: 16, ml: 5, fontWeight: "semibold" }}>Limpiar filtros</Typography>
              </IconButton>
            </Box>

            <Box sx={{ display: "flex", gap: "16px", marginTop: "16px" }}>
              <Box>
                <TextField
                  fullWidth
                  size= 'small'
                  label="Razón Social"
                  value={razonSocial || ""}
                  onChange={(e) => setRazonSocial(e.target.value || null)}
                />
                <LocalizationProviderCustom>
                  <DatePicker
                    value={fechaCreacion}
                    label="Fecha de creación"
                    onChange={(newValue) => setFechaCreacion(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                 />
                </LocalizationProviderCustom>
                <AutocompleteFiltro
                  label="País"
                  value={pais}
                  fetchOptions={buscarPaises}
                  onChange={(value) => setPais(value || null)}
                />
                <AutocompleteFiltro
                  label="Estado"
                  value={estado}
                  fetchOptions={fetchEstadosContratistas}
                  onChange={(value) => setEstado(value || null)}
                />
              </Box>

              <Box>
                <TextField
                size= 'small'
                  fullWidth
                  label="N° de identificación"
                  value={numeroIdentificacion || ""}
                  onChange={(e) => setNumeroIdentificacion(Number(e.target.value) || null)}
                />
                <TextField
                size= 'small'
                  fullWidth
                  label="Email Comercial"

                  value={emailComercial || ""}
                  onChange={(e) => setEmailComercial(e.target.value || null)}
                />
                <AutocompleteFiltro
                  label="Origen"
                  value={origen}
                  fetchOptions={fetchOrigen}
                  onChange={(value) => setOrigen(value || null)}
                />
                <AutocompleteFiltro
                  label="Bloqueo"
                  value={bloqueo || null}
                  getOptionLabel={(option) => option.label}
                  fetchOptions={fetchEstadosBloqueosFiltos}
                  onChange={(value) => setBloqueo(value || null)}
                                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
              <Button className="MuiButton-secondary" variant="contained" onClick={handleClose} sx={{ marginRight: "8px" }}>
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
