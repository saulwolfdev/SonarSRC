import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";

interface DefinicionGenealProps {
  response: any;
  withoutIntegration?: boolean;
}
export default function DefinicionGenealOnlyEdit({
  response,
  withoutIntegration,
}: DefinicionGenealProps) {
  const [origen, setOrigen] = useState("");
  const [codigoProvedor, setCodigoProvedor] = useState("");
  const [fechaCreacion, setFechaCreacion] = useState("");
  useEffect(() => {
    if (response) {
      setOrigen(response.origen.nombre);
      setCodigoProvedor(response.codigoProvedor);

      const fecha = new Date(response.fechaCreacion);
      const dia = fecha.getDate().toString().padStart(2, "0");
      const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
      const año = fecha.getFullYear();
      const fechaFormateada = `${dia}/${mes}/${año}`;
      setFechaCreacion(fechaFormateada);
    }
  }, [response]);

  return (
    <Box
      display="flex"
      flexDirection="row"
      sx={{ width: "100%", ml: { md: 8 } }}
    >
      <TextField
        value={origen}
        disabled
        id="origen"
        name="origen"
        label="Origen"
        className="input-position-1-of-3"
        size="small"
      />
      <TextField
        value={codigoProvedor}
        disabled
        id="codigoProvedor"
        name="codigoProvedor"
        label="CodigoProvedor - SAP/Acreedor"
        className="input-position-2-or-3-of-3"
        size="small"
      />
      <TextField
        value={fechaCreacion}
        disabled
        id="fechaCreacion"
        name="fechaCreacion"
        label="Fecha creacion"
        className="input-position-2-or-3-of-3"
        size="small"
      />
    </Box>
  );
}
