import { Box, Card, TextField, Typography } from "@mui/material";
import { useState } from "react";
import RegistrosExistentes from "./RegistrosExistentes";
import {
  TurnoAPI,
  TurnoDetalleResponce,
} from "@/types/microMaestros/turnosTypes";
import { fetchTurnos } from "@/services/microMaestros/turnosService";

interface InputsCreateUpdateProps {
  formik: any;
  response?: TurnoDetalleResponce | null;
}

export function InputsCreateUpdateTurno({
  formik,
  response,
}: InputsCreateUpdateProps) {
  const [turnosExisting, setTurnosExisting] = useState<TurnoAPI[]>([]);

  const handleChangeTurno = (event: any) => {
    formik.handleChange(event);
    if (event.target.value.length > 2) {
      fetchTurnos({ nombre: event.target.value })
        .then((response) => {
          setTurnosExisting(response.data);
        })
        .catch((error) => {});
    } else {
      setTurnosExisting([]);
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
          onChange={handleChangeTurno}
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
          label="% adicional turno *"
          value={formik.values.porcentajeAdicionalTurno}
          onChange={formikChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.porcentajeAdicionalTurno &&
            Boolean(formik.errors.porcentajeAdicionalTurno)
          }
          helperText={
            formik.touched.porcentajeAdicionalTurno &&
            formik.errors.porcentajeAdicionalTurno
          }
          sx={{
            mt: { md: 15 },
            ml: { md: 21 },
            width: { md: "30%" },
          }}
          size="small"
        />
      </Box>
      <RegistrosExistentes conveniosExisting={turnosExisting} />
    </Box>
  );
}

const dummy = () => {
  console.log("...");
};
export default dummy;
