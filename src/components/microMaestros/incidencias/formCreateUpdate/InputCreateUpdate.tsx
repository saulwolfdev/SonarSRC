import { Box, TextField, Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";

interface InputsCreateUpdateProps {
  formik: any;
}

export function InputCreateUpdate({ formik }: InputsCreateUpdateProps) {
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
        Información General
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mt: { md: 15 },
          ml: { md: 21 },
          p: 40,
          gap: 20,
        }}
      >
        <TextField
          id="nombre"
          name="nombre"
          label="Nombre*"
          value={formik.values.nombre}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          size="small"
          error={formik.touched.nombre && Boolean(formik.errors.nombre)}
          helperText={formik.touched.nombre && formik.errors.nombre}
          sx={{ width: { md: "30%" } }}
        />
        <RadioGroup
          row
          name="tipo"
          value={formik.values.tipo}
          onChange={formik.handleChange}
          sx={{ display: "flex" }}
        >
          <FormControlLabel value="Default" control={<Radio />} label="Default" />
          <FormControlLabel value="MOP" control={<Radio />} label="MOP" />
        </RadioGroup>
      </Box>
    </Box>
  );
}

export default InputCreateUpdate;
