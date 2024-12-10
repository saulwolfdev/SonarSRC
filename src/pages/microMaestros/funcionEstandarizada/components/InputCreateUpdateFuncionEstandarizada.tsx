import { Box, TextField, Typography } from "@mui/material";
import RegistrosExistentes from "./RegistrosExistentes";
import { FuncionesEstandarizadasAPI } from "@/types/microMaestros/funcionEstandarizadaTypes";
import { useState } from "react";
import { fetchName } from "@/services/microMaestros/funcionEstandarizadaService";

interface InputsCreateUpdateProps {
  formik: any;
}

export function InputCreateUpdateFuncionEstandarizada({ formik }: InputsCreateUpdateProps) {
  const [funcionesExisting, setFuncionesExisting] = useState<FuncionesEstandarizadasAPI[]>([]);

  const handleChangeNombre = (event: any) => {
    formik.handleChange(event);
    if (event.target.value.length > 2) {
      fetchName({ nombre: event.target.value })
        .then((response: any) => {
          setFuncionesExisting(response.data);
        })
        .catch((error: any) => {});
    } else {
      setFuncionesExisting([]);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "50vh",
        p: 3,
      }}
    >
      <Box>
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            color: "grey",
            mt: { md: 15 },
            mb: { md: 15 },
            ml: { md: 21 },
          }}
        >
          Datos
        </Typography>
        <TextField
          label="Nombre"
          name="nombre"
          value={formik.values.nombre}
          onChange={handleChangeNombre}
          onBlur={formik.handleBlur}
          error={formik.touched.nombre && Boolean(formik.errors.nombre)}
          helperText={
            formik.touched.nombre && formik.errors.nombre ? (
              <Typography
                variant="caption"
                color="error"
                sx={{ minHeight: "1.5rem", display: "block" }}
              >
                {formik.errors.nombre}
              </Typography>
            ) : (
              <Box sx={{ minHeight: "1.5rem" }} /> // Espacio reservado sin error
            )
          }
          variant="outlined"
          sx={{
            width: "33%",
            mb: 16,
            ml: 16,
          }}
          inputProps={{ maxLength: 80 }}
        />

        <RegistrosExistentes funcionesExisting={funcionesExisting} />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 4,
          pr: 3,
        }}
      >
      </Box>
    </Box>
  );
}

const dummy = () => {
  console.log('...')
}
export default dummy