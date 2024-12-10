import React from "react";
import { TextField, Box, Typography } from "@mui/material";

export function InputsCategoriasMonotributo({
  formik
}: any) {

  return (
    <Box className="box-form-create-update" sx={{ mb: 32 }}>
      <Typography variant="body1" sx={{ mb: 24, mt: 32, ml: 16 }}>
        Datos
      </Typography>
      <TextField
              id="nombre"
              label="Nombre Diagrama Trabajo*"
              name="nombre"
              value={formik.values.nombre}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nombre && Boolean(formik.errors.nombre)}
              helperText={formik.touched.nombre && formik.errors.nombre}
              sx={{ width: "30%", mr: { md: 80 } }}
            />
    </Box>
  )
}

// export default InputsCategoriasMonotributo;

const dummy = () => {
  console.log('...')
}
export default dummy