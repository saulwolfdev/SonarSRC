import { Box, TextField, Typography } from "@mui/material";
import { useEffect } from "react";

interface InputsCreateUpdateProps {
  formik: any;
  response?: any;
}

export function InputsCreateUpdate({
  formik,
  response,
}: InputsCreateUpdateProps) {
  const { setValues } = formik;

  useEffect(() => {
    if (response) {
      setValues(response);
    }
  }, [response, setValues]);

  return (
    <>
      <Box
        sx={{
          border: "1px solid #D6D6D68A",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          mt: 40,
          p: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mt: 30,
            ml: 40,
            fontSize: 20,
            fontWeight: 600,
            lineHeight: 1.5,
            color: "grey",
          }}
        >
          Definición general
        </Typography>

        <Box
          sx={{
            pl: 40,
            pr: 40,
            pt: 20,
            pb: 40, 
            borderRadius: 2,
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 18,
          }}
        >
          {/* Input de Nombre */}
          <TextField
            id="nombre"
            name="nombre"
            label="Nombre*"
            value={formik.values.nombre}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.nombre && Boolean(formik.errors.nombre)}
            helperText={formik.touched.nombre && formik.errors.nombre}
            sx={{
              width: "30%",
            }}
            size="small"
          />

          {/* Input de Descripción */}
          <TextField
            id="descripcion"
            name="descripcion"
            label="Descripción"
            value={formik.values.descripcion}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
            helperText={formik.touched.descripcion && formik.errors.descripcion}
            sx={{
              width: "100%",
            }}
            size="small"
          />
        </Box>
      </Box>
    </>
  );
}

const dummy = () => {
  console.log('...')
}
export default dummy