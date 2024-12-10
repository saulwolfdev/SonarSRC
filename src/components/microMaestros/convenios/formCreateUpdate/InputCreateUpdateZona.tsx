import { Box, Card, TextField, Typography } from "@mui/material";
import { useState } from "react";
import RegistrosExistentes from "./RegistrosExistentes";
import {
  ZonaAPI,
  ZonaDetalleResponce,
} from "@/types/microMaestros/zonasTypes";
import { fetchZonas } from "@/services/microMaestros/zonasService";

interface InputsCreateUpdateProps {
  formik: any;
  response?: ZonaDetalleResponce | null;
}

export function InputsCreateUpdateZona({
  formik,
  response,
}: InputsCreateUpdateProps) {
  const [zonasExisting, setZonasExisting] = useState<ZonaAPI[]>([]);

  const handleChangeZona = (event: any) => {
    formik.handleChange(event);
    if (event.target.value.length > 2) {
      fetchZonas({ nombre: event.target.value })
        .then((response) => {
          setZonasExisting(response.data);
        })
        .catch((error) => {});
    } else {
      setZonasExisting([]);
    }
  };

  const formikChange = (event: any) => {
    formik.setFieldValue(event.target.name, event.target.value);
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-start",
        }}
      >
        <TextField
          size="small"
          id="nombre"
          name="nombre"
          label="Nombre*"
          value={formik.values.nombre}
          onChange={handleChangeZona}
          onBlur={formik.handleBlur}
          error={formik.touched.nombre && Boolean(formik.errors.nombre)}
          helperText={formik.touched.nombre && formik.errors.nombre}
          sx={{
            mt: { md: 15 },
            ml: { md: 21 },
            width: { md: "30%" },
          }}
        />
        <TextField
          id="porcentajeAdicional"
          name="porcentajeAdicional"
          label="% adicional zona *"
          value={formik.values.porcentajeAdicionalZona}
          onChange={formikChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.porcentajeAdicionalZona &&
            Boolean(formik.errors.porcentajeAdicionalZona)
          }
          helperText={
            formik.touched.porcentajeAdicionalZona &&
            formik.errors.porcentajeAdicionalZona
          }
          sx={{
            mt: { md: 15 },
            ml: { md: 21 },
            width: { md: "30%" },
          }}
          size="small"
        />
      </Box>
      <RegistrosExistentes conveniosExisting={zonasExisting} />
    </Box>
  );
}

const dummy = () => {
  console.log("...");
};
export default dummy;
