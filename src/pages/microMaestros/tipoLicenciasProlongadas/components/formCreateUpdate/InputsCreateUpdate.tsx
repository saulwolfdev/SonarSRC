"use Client";

import { Box, Card, FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import AutocompleteUpdateCreate from "@/components/shared/AutocompleteCreateUpdate";
import { useEffect, useState } from "react";
import {
  TipoLicenciasProlongadasAPI,
  TipoLicenciasProlongadasDetalleResponce,
  TipoLicenciasProlongadasCreateUpdateFormik,
} from "../../../../../types/microMaestros/tipoLicenciasProlongadasTypes";
import {
  fetchTipoLicenciasProlongadas,
} from "../../../../../services/microMaestros/tipoLicenciasProlongadasService";
import { FormikProps } from "formik";

interface InputsCreateUpdateProps {
  formik: FormikProps<TipoLicenciasProlongadasCreateUpdateFormik>;
  response?: TipoLicenciasProlongadasDetalleResponce | null;
}
export function InputsCreateUpdate({
  formik,
  response,
}: InputsCreateUpdateProps) {
  const [centrosExisting, setCentrosExisting] = useState<TipoLicenciasProlongadasAPI[]>([]);

  useEffect(() => {
    if (response) {
    }
  }, [response]);


  const handleChangenombre = (event: any) => {
    formik.handleChange(event);
    if (event.target.value.length > 2) {
      fetchTipoLicenciasProlongadas({ nombre: event.target.value })
        .then((response) => {
          setCentrosExisting(response.data);
        })
        .catch((error) => { });
    } else {
      setCentrosExisting([]);
    }
  };



  const handleChangeObservacionObligatoria = (event: any) => {
    const newValue = event.target.value == 'true'
    formik.setFieldValue(event.target.name, newValue);
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
          justifyContent: "space-between",
        }}
      >
        <TextField
          id="nombre"
          name="nombre"
          label="Nombre"
          value={formik.values.nombre}
          onChange={handleChangenombre}
          onBlur={formik.handleBlur}
          error={formik.touched.nombre && Boolean(formik.errors.nombre)}
          helperText={formik.touched.nombre && formik.errors.nombre}
          sx={{
            mt: { md: 15 },
            ml: { md: 21 },
            width: { md: "30%" },
          }}
          size="small"
        />
    
      </Box>
    </Box>
  );
}
const dummy = () => {
  console.log('...')
}
export default dummy