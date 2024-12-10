import { Box, Card, TextField, Typography } from "@mui/material";
import { useState } from "react";
import RegistrosExistentes from "./RegistrosExistentes";
import {
  TituloAPI,
  TituloDetalleResponce,
} from "@/types/microMaestros/titulosTypes";
import { fetchTitulos } from "@/services/microMaestros/titulosService";

interface InputsCreateUpdateProps {
  formik: any;
  response?: TituloDetalleResponce | null;
}

export function InputsCreateUpdateTitulo({
  formik,
  response,
}: InputsCreateUpdateProps) {
  const [titulosExisting, setTitulosExisting] = useState<TituloAPI[]>([]);

  const handleChangeTitulo = (event: any) => {
    formik.handleChange(event);
    if (event.target.value.length > 2) {
      fetchTitulos({ nombre: event.target.value })
        .then((response) => {
          setTitulosExisting(response.data);
        })
        .catch((error) => {});
    } else {
      setTitulosExisting([]);
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
          size='small'
          id="nombre"
          name="nombre"
          label="Nombre*"
          value={formik.values.nombre}
          onChange={handleChangeTitulo}
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
          id="nombreCategoria"
          name="nombreCategoria"
          label="Categoria *"
          value={formik.values.nombreCategoria}
          onChange={formikChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.nombreCategoria &&
            Boolean(formik.errors.nombreCategoria)
          }
          helperText={
            formik.touched.nombreCategoria && formik.errors.nombreCategoria
          }
          sx={{
            mt: { md: 15 },
            ml: { md: 21 },
            mb: { md: 15 },
            width: { md: "30%" },
          }}
          size="small"
        />
      </Box>
      <RegistrosExistentes conveniosExisting={titulosExisting} />
    </Box>
  );
}

const dummy = () => {
  console.log("...");
};
export default dummy;
