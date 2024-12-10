import { Box, TextField, Typography } from "@mui/material";

export function InputCreateUpdate({ formik }: any) {
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
      <TextField
        label="Nombre"
        name="nombre"
        value={formik.values.nombre}
        onChange={(e) => {
          formik.setFieldTouched("nombre", true);
          formik.handleChange(e);
          //Para que formik valide desde la primera vez que se toque el campo
        }}
        onBlur={formik.handleBlur}
        variant="outlined"
        sx={{
          width: "33%",
          mb: 16,
          ml: 16,
        }}
        inputProps={{ maxLength: 80 }}
        helperText={formik.touched.nombre && formik.errors.nombre}
        error={formik.touched.nombre && Boolean(formik.errors.nombre)}
      />
    </Box>
  );
}

const dummy = () => {
  console.log('...')
}
export default dummy