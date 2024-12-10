import { Box, TextField, Typography } from "@mui/material";

interface InputsCreateUpdateProps {
  formik: any;
}

export function InputCreateUpdate({ formik }: InputsCreateUpdateProps) {
  return (
    <Box className="box-form-create-update" sx={{ mb: 32 }}>
      <Typography
        variant="body1"
        sx={{
          fontWeight: "bold",
          color: "grey",
          mb: 24, 
          mt: 32, 
          ml: 16
        }}
      >
        Definición general
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', ml: 16, mb: 16 }}>
        <TextField
          label="Nombre"
          name="nombre"
          required
          value={formik.values.nombre}
          onChange={(e) => {
            formik.setFieldTouched("nombre", true);
            formik.handleChange(e);
          }}
          onBlur={formik.handleBlur}
          error={formik.touched.nombre && Boolean(formik.errors.nombre)}
          helperText={formik.touched.nombre && formik.errors.nombre}
          variant="outlined"
          sx={{
            width: "33%",
            mr: 16,
          }}
          inputProps={{ maxLength: 80 }}
        />
        <TextField
          label="Código AFIP"
          name="codigoAfip"
          required
          value={formik.values.codigoAfip}
          onChange={(e) => {
            formik.setFieldTouched("codigoAfip", true);
            formik.handleChange(e);
          }}
          onBlur={formik.handleBlur}
          error={formik.touched.codigoAfip && Boolean(formik.errors.codigoAfip)}
          helperText={formik.touched.codigoAfip && formik.errors.codigoAfip}
          variant="outlined"
          sx={{
            width: "33%",
          }}
          inputProps={{ maxLength: 10 }}
        />
      </Box>
    </Box>
  );
}


const dummy = () => {
  console.log('...')
}
export default dummy