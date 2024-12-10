import React, { useEffect, useState } from "react";
import { TextField, Box, Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import AccordionForm from "@/components/shared/AcordeonForm";
import { buscarRelacionServicio } from "@/services/microMaestros/motivoAfectacionService";
import AutocompleteMultipleUpdateCreate from "@/components/shared/AutocompleteMultipleCreateUpdate";
import { IdOption } from "@/types/microMaestros/GenericTypes";

export function InputsMotivoAfectacion({
  formik
}: any) {

  const [solicitarFechaIncorporacion, setSolicitarFechaIncorporacion] = useState<boolean | null>(null);
  const [bajaCesion, setBajaCesion] = useState<boolean | null>(null);
  const [afectacionTemporal, setAfectacionTemporal] = useState<boolean | null>(null);
  const [relacionServicioSeleccionado, setRelacionServicioSeleccionado] = useState<IdOption[]>([]);

  useEffect(() => {
    const fetchAndMapInitialValues = async () => {
      if (formik.values.relacionServicio) {
        const opciones = await buscarRelacionServicio();
        const selectedValues = opciones.filter((option: IdOption) =>
          formik.values.relacionServicio.includes(option.id)
        );
        setRelacionServicioSeleccionado(selectedValues);
      }
    };
    fetchAndMapInitialValues();
  }, [formik.values.relacionServicio]);


  const handleFechaIncorporacion = (event: any) => {
    const value = event.target.value === "true";
    setSolicitarFechaIncorporacion(value);
    formik.setFieldValue("fechaIncorporacion", value);
  };

  const handleBajaCesion = (event: any) => {
    const value = event.target.value === "true";
    setBajaCesion(value);
    formik.setFieldValue("bajaPorCesion", value);
  };

  const handleAfectacionTemporal = (event: any) => {
    const value = event.target.value === "true";
    setAfectacionTemporal(value);
    formik.setFieldValue("afectacionTemporal", value);
  };

  const formikChange = (event: any) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };

  const handleChangeRelacionServicio = (event: any, newValue: IdOption[]) => {
    setRelacionServicioSeleccionado(newValue);
    const ids = newValue.map((option) => option.id);
    formik.setFieldValue("relacionServicio", ids);
  };

  return (
    <Box className="box-form-create-update">
      <AccordionForm title="Definición general">
        <TextField
          id="motivoDeAfectacion"
          label="Motivo de afectación *"
          name="motivoDeAfectacion"
          value={formik.values.motivoDeAfectacion}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.motivoDeAfectacion && Boolean(formik.errors.motivoDeAfectacion)}
          helperText={formik.touched.motivoDeAfectacion && formik.errors.motivoDeAfectacion}
          size="small"
          className="input-position-1-of-3"
        />
        <AutocompleteMultipleUpdateCreate
          idText="relacionServicio"
          name="relacionServicio"
          label="Relación de Servicio *"
          values={relacionServicioSeleccionado}
          fetchOptions={buscarRelacionServicio}
          onChange={handleChangeRelacionServicio}
          formikChange={formikChange}
          onBlur={formik.handleBlur}
          error={formik.touched.relacionServicio && Boolean(formik.errors.relacionServicio)}
          helperText={formik.touched.relacionServicio && formik.errors.relacionServicio}
          sx={{
            mt: { md: 15 },
            mr: { md: 21 },
            ml: { md: 21 },
            mb: { md: 15 },
            width: { md: "30%" },
          }}
        />
        <Typography variant="body1" sx={{ mt: { md: 24 } }}>Solicitar fecha de incorporación</Typography>
        <RadioGroup
          aria-label="fechaIncorporacion"
          name="fechaIncorporacion"
          sx={{ display: "flex", flexDirection: "row", pl: 20 }}
          value={formik.values.fechaIncorporacion}
          onChange={handleFechaIncorporacion}             >
          <FormControlLabel value="true" control={<Radio />} label="Sí" />
          <FormControlLabel
            value="false"
            control={<Radio />}
            label="No"
          />
        </RadioGroup>
        <Box sx={{ width: "70%", display: "inline-flex" }}>
          <Typography variant="body1" sx={{ mt: { md: 32 }, ml: { md: 32 }, mb: { md: 32 } }}>Baja por cesión</Typography>
          <RadioGroup
            aria-label="bajaPorCesion"
            name="bajaPorCesion"
            sx={{ display: "flex", flexDirection: "row", pl: 20 }}
            value={formik.values.bajaPorCesion}
            onChange={handleBajaCesion}             >
            <FormControlLabel value="true" control={<Radio />} label="Sí" />
            <FormControlLabel
              value="false"
              control={<Radio />}
              label="No"
            />
          </RadioGroup>

          <Typography variant="body1" sx={{ mt: { md: 32 }, ml: { md: 190 } }}>Afectación temporal</Typography>
          <RadioGroup
            aria-label="afectacionTemporal"
            name="afectacionTemporal"
            sx={{ display: "flex", flexDirection: "row", pl: 20 }}
            value={formik.values.afectacionTemporal}
            onChange={handleAfectacionTemporal}             >
            <FormControlLabel value="true" control={<Radio />} label="Sí" />
            <FormControlLabel
              value="false"
              control={<Radio />}
              label="No"
            />
          </RadioGroup>
        </Box>
      </AccordionForm>
    </Box>
  )
}

export default InputsMotivoAfectacion;