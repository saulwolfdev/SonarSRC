"use client";

import { Box, Typography, TextField, RadioGroup, FormControlLabel, Radio } from "@mui/material";

interface InputsCreateUpdateProps {
  formik: any;
}

const InputsCreateUpdate = ({ formik }: InputsCreateUpdateProps) => {
  const handleRadioChange = (event: any) => {
    const { name, value } = event.target;
    formik.setFieldValue(name, value === 'true');
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
          flexDirection: "column",
          gap: 20,
          mt: 20,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            ml: 30,
            gap: 10,
          }}
        >
          {/* Campo Nombre */}
          <Box>
            <TextField
              id="nombre"
              name="nombre"
              label="Nombre"
              sx={{
                width: 400,
                '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#000', 
                },
              }}
              fullWidth
              disabled
              value={formik.values.nombre}
              size="small"
            />
          </Box>

          {/* Campo Origen */}
          <Box>
            <TextField
              id="origenNombre"
              name="origenNombre"
              label="Origen"
              fullWidth
              sx={{
                width: 400,
                '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#000', 
                },
              }}
              disabled
              value={formik.values.origenNombre}
              size="small"
            />
          </Box>
        </Box>
        <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          ml: 10,
          gap: 110,
        }}
        >
          {/* Radio Button Envia Notificación */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              ml: 30,
              gap: 50,
              alignItems: "center",
            }}
          >
            <Typography variant="body1" sx={{ mb: 1 }}>
              Envia Notificación
            </Typography>
            <RadioGroup
              aria-label="enviaNotificacion"
              name="enviaNotificacion"
              value={formik.values.enviaNotificacion ? "true" : "false"}
              onChange={handleRadioChange}
              row
            >
              <FormControlLabel value="true" control={<Radio />} label="Sí" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </Box>

          {/* Radio Button Envia Comunicación Formal */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 50,
              alignItems: "center",
            }}
          >
            <Typography variant="body1" sx={{ mb: 1 }}>
              Envia Comunicación Formal
            </Typography>
            <RadioGroup
              aria-label="enviaComunicacionFormal"
              name="enviaComunicacionFormal"
              value={formik.values.enviaComunicacionFormal ? "true" : "false"}
              onChange={handleRadioChange}
              row
            >
              <FormControlLabel value="true" control={<Radio />} label="Sí" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InputsCreateUpdate;
