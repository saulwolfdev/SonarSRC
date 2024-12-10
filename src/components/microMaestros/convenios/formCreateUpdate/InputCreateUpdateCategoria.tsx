import { Box, Card, TextField, Typography } from "@mui/material";
import { useState } from "react";
import RegistrosExistentes from "./RegistrosExistentes";
import { CategoriaAPI, CategoriaDetalleResponce } from "@/types/microMaestros/categoriasTypes";
import { fetchCategorias } from "@/services/microMaestros/categoriasService";

interface InputsCreateUpdateProps {
  formik: any;
  response?: CategoriaDetalleResponce | null;
}

export function InputsCreateUpdateCategoria({
  formik,
  response,
}: InputsCreateUpdateProps) {
  const [categoriasExisting, setCategoriasExisting] = useState<
    CategoriaAPI[]
  >([]);

  const handleChangeCategoria = (event: any) => {
    formik.handleChange(event);
    if (event.target.value.length > 2) {
      fetchCategorias({ nombre: event.target.value })
        .then((response) => {
          setCategoriasExisting(response.data);
        })
        .catch((error) => {});
    } else {
      setCategoriasExisting([]);
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
        label="Nombre*"
        value={formik.values.nombre}
        onChange={handleChangeCategoria}
        onBlur={formik.handleBlur}
        error={formik.touched.nombre && Boolean(formik.errors.nombre)}
        helperText={formik.touched.nombre && formik.errors.nombre}
        sx={{
          mt: { md: 15 },
          ml: { md: 21 },
          width: { md: "30%" },
        }}
      />
      <RegistrosExistentes conveniosExisting={categoriasExisting} />
    </Box>
  );
}

const dummy = () => {
  console.log('...')
}
export default dummy