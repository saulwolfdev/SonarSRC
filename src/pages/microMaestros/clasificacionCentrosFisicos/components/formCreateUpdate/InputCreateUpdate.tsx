import { Box, Card, TextField, Typography } from "@mui/material";
import { useState } from "react";
import {
  ClasificacionCentroFisicoAPI,
  ClasificacionCentroFisicoDetalleResponce,
} from "@/types/microMaestros/clasificacionCentrosFisicosTypes";
import { fetchClasificacionCentroFisico } from "@/services/microMaestros/clasificacionCentroFisicoService";
import RegistrosExistentes from "./RegistrosExistentes";

interface InputsCreateUpdateProps {
  formik: any;
  response?: ClasificacionCentroFisicoDetalleResponce | null;
}

export function InputsCreateUpdate({
  formik,
  response,
}: InputsCreateUpdateProps) {
  const [clasificacionesExisting, setClasificacionesExisting] = useState<
    ClasificacionCentroFisicoAPI[]
  >([]);

  const handleChangeClasificacion = (event: any) => {
    formik.handleChange(event);
    if (event.target.value.length > 2) {
      fetchClasificacionCentroFisico({ nombre: event.target.value })
        .then((response) => {
          setClasificacionesExisting(response.data);
        })
        .catch((error) => {});
    } else {
      setClasificacionesExisting([]);
    }
  };
  return (
    <Box className="box-form-create-update">
      <Typography
        variant="body1"
        sx={{
          fontWeight: "bold",
          color: "grey",
          mt: { md: 15 },
          ml: { md: 21 },
        }}
      >
        Definición general
      </Typography>
      <TextField
        id="nombre"
        name="nombre"
        label="Clasificacion*"
        value={formik.values.nombre}
        onChange={handleChangeClasificacion}
        onBlur={formik.handleBlur}
        error={formik.touched.nombre && Boolean(formik.errors.nombre)}
        helperText={formik.touched.nombre && formik.errors.nombre}
        sx={{
          mt: { md: 15 },
          ml: { md: 21 },
          width: { md: "30%" },
        }}
      />
      <RegistrosExistentes clasificacionesExisting={clasificacionesExisting} />
    </Box>
  );
}

const dummy = () => {
  console.log('...')
}
export default dummy