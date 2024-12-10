"use Client";

import { Box, Card, FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import AutocompleteUpdateCreate from "@/components/shared/AutocompleteCreateUpdate";
// import RegistrosExistentes from "./RegistrosExistentes";
import { useEffect, useState } from "react";
import {
  MotivoDelegacionAPI,
  MotivoDelegacionDetalleResponce,
  MotivoDelegacionCreateUpdateFormik,
} from "../../../../../types/microMaestros/motivoDelegacionTypes";
import {
  fetchMotivoDelegacion,
} from "../../../../../services/microMaestros/motivoDelegacionService";
import { FormikProps } from "formik";

interface InputsCreateUpdateProps {
  formik: FormikProps<MotivoDelegacionCreateUpdateFormik>;
  response?: MotivoDelegacionDetalleResponce | null;
}
export function InputsCreateUpdate({
  formik,
  response,
}: InputsCreateUpdateProps) {
  const [centrosExisting, setCentrosExisting] = useState<MotivoDelegacionAPI[]>([]);
  // const [observacionObligatoria, setObservacionObligatoria] =
  //   useState<IdOption | null>(null);

  useEffect(() => {
    if (response) {
      // setObservacionObligatoria({
      //   id: response.observacionObligatoria.boolean,
      //   label: response.observacionObligatoria.isoName,
      // });
    }
  }, [response]);

  const handleChangeTiempoLimite = (event: any) => {
    formik.handleChange(event);
    if (event.target.value.length > 2) {
      fetchMotivoDelegacion({ tiempoLimite: event.target.value })
        .then((response) => {
          setCentrosExisting(response.data);
        })
        .catch((error) => { });
    } else {
      setCentrosExisting([]);
    }
  };

  const handleChangeNombreMotivo = (event: any) => {
    formik.handleChange(event);
    if (event.target.value.length > 2) {
      fetchMotivoDelegacion({ nombreMotivo: event.target.value })
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
          id="nombreMotivo"
          name="nombreMotivo"
          label="Nombre motivo*"
          value={formik.values.nombreMotivo}
          onChange={handleChangeNombreMotivo}
          onBlur={formik.handleBlur}
          error={formik.touched.nombreMotivo && Boolean(formik.errors.nombreMotivo)}
          helperText={formik.touched.nombreMotivo && formik.errors.nombreMotivo}
          sx={{
            mt: { md: 15 },
            ml: { md: 21 },
            width: { md: "30%" },
          }}
          size="small"
        />
        <TextField
          id="tiempoLimite"
          name="tiempoLimite"
          label="Tiempo limite*"
          type="number"
          value={formik.values.tiempoLimite}
          onChange={handleChangeTiempoLimite}
          onBlur={formik.handleBlur}
          error={formik.touched.tiempoLimite && Boolean(formik.errors.tiempoLimite)}
          helperText={formik.touched.tiempoLimite && formik.errors.tiempoLimite}
          sx={{
            mt: { md: 15 },
            ml: { md: 21 },
            width: { md: "30%" },
          }}
          size="small"
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mt: { md: 15 },
            ml: { md: 21 },
            width: { md: "30%" },
          }}
        >
          <Typography variant="body1" sx={{ mr: 20 }}>
            Observación obligatoria*:
          </Typography>
          <RadioGroup
            aria-label="observacionObligatoria"
            name="observacionObligatoria"
            value={formik.values.observacionObligatoria}
            onChange={handleChangeObservacionObligatoria}
            onBlur={formik.handleBlur}
            row
          >
            <FormControlLabel
              value={true}
              control={<Radio size="small" />}
              label="Sí"
            />
            <FormControlLabel
              value={false}
              control={<Radio size="small" />}
              label="No"
            />
          </RadioGroup>
          {formik.touched.observacionObligatoria && formik.errors.observacionObligatoria && (
            <FormHelperText error>{formik.errors.observacionObligatoria}</FormHelperText>
          )}
        </Box>


      </Box>
      {/* <RegistrosExistentes centrosExisting={centrosExisting} /> */}
    </Box>
  );
}
const dummy = () => {
  console.log('...')
}
export default dummy