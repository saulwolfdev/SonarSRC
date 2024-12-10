import { Box, Card, styled, TextField, Typography } from "@mui/material";
import { useState } from "react";
import RegistrosExistentes from "./RegistrosExistentes";
import AutocompleteMultipleUpdateCreate from "@/components/shared/AutocompleteMultipleCreateUpdate";
import { IdOption } from "@/types/microMaestros/GenericTypes";
import {
  ConvenioAPI,
  ConvenioDetalleResponce,
} from "@/types/microMaestros/convenioColectivoTypes";
import { fetchConvenios, fetchPAsociacionesArgentinasHabilitadas } from "@/services/microMaestros/conveniosColectivoService";
import AccordionForm from "@/components/shared/AcordeonForm";

import { TimeField } from '@mui/x-date-pickers/TimeField';
import LocalizationProviderCustom from "@/components/shared/LocalizationProviderCustom";
import dayjs from 'dayjs';

interface InputsCreateUpdateProps {
  formik: any;
  response?: ConvenioDetalleResponce | null;
}


export function InputsCreateUpdateConvenio({
  formik,
  response,
}: InputsCreateUpdateProps) {
  const [conveniosExisting, setConveniosExisting] = useState<ConvenioAPI[]>([]);
  const [asociacionesIdsSeleccionadas, setAsociacionesIdsSeleccionadas] = useState<
    IdOption[]
  >([]);

  const handleChangeNombre = (event: any) => {
    formik.handleChange(event);
    if (event.target.value.length > 2) {
      fetchConvenios({ nombre: event.target.value })
        .then((response) => {
          setConveniosExisting(response.data);
        })
        .catch((error) => {});
    } else {
      setConveniosExisting([]);
    }
  };

  const formikChange = (event: any) => {
    formik.setFieldValue(event.target.name, event.target.value);
  };

  const handleChangeAsociacionesIdsSeleccionadas = (event: any, newValue: any) => {
    setAsociacionesIdsSeleccionadas(newValue);
  };

  return (
    <>
      <AccordionForm title="Definición general">
        <AutocompleteMultipleUpdateCreate
          idText="asociacionesGremialesId"
          name="asociacionesGremialesId"
          label="Asociaciones/s*"
          values={asociacionesIdsSeleccionadas}
          fetchOptions={fetchPAsociacionesArgentinasHabilitadas}
          onChange={handleChangeAsociacionesIdsSeleccionadas}
          formikChange={formikChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.asociacionesGremialesId && Boolean(formik.errors.asociacionesGremialesId)
          }
          helperText={formik.touched.asociacionesGremialesId && formik.errors.asociacionesGremialesId}
          sx={{
            mt: { md: 15 },
            mr: { md: 21 },
            ml: { md: 21 },
            mb: {md: 15},
            width: { md: "30%" },
          }}
        />
        <TextField
          id="nombre"
          name="nombre"
          label="Nombre*"
          value={formik.values.nombre}
          onChange={handleChangeNombre}
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
        <LocalizationProviderCustom>
        <TimeField 
            format="HH:mm" // Establece el formato 24h
            name="horasDiariasDeTrabajo"
            label="Horas dirarias de trabajo*"
            onChange={(newValue) => {
              const formattedValue = newValue?.format("HH:mm:ss");
              formik.setFieldValue("horasDiariasDeTrabajo", formattedValue);
            }}
              slotProps={{
                textField: {
                  onBlur: formik.handleBlur,
                  error:formik.touched.horasDiariasDeTrabajo && Boolean(formik.errors.horasDiariasDeTrabajo),
                  helperText: formik.touched.horasDiariasDeTrabajo && formik.errors.horasDiariasDeTrabajo, 
                  sx: {
                    mt: { md: 15 },
                    ml: { md: 21 },
                    width: { md: "30%" },
                    fontSize: "2.5rem",
                  },
                  size: "small",
                },
              }}
          />
        </LocalizationProviderCustom>
        <RegistrosExistentes conveniosExisting={conveniosExisting} />
      </AccordionForm>
      <AccordionForm title="Título" sx={{justifyContent: "flex-start"}}>
        <TextField
          id="nombreTitulo"
          name="nombreTitulo"
          label="Nombre*"
          value={formik.values.nombreTitulo}
          onChange={formikChange}
          onBlur={formik.handleBlur}
          error={formik.touched.nombreTitulo && Boolean(formik.errors.nombreTitulo)}
          helperText={formik.touched.nombreTitulo && formik.errors.nombreTitulo}
          sx={{
            mt: { md: 15 },
            ml: { md: 21 },
            mb: {md: 15},
            width: { md: "30%" },
          }}
          size="small"
        />
        <TextField
          id="nombreCategoriaTitulo"
          name="nombreCategoriaTitulo"
          label="Categoria *"
          value={formik.values.nombreCategoriaTitulo}
          onChange={formikChange}
          onBlur={formik.handleBlur}
          error={formik.touched.nombreCategoriaTitulo && Boolean(formik.errors.nombreCategoriaTitulo)}
          helperText={formik.touched.nombreCategoriaTitulo && formik.errors.nombreCategoriaTitulo}
          sx={{
            mt: { md: 15 },
            ml: { md: 21 },
            mb: {md: 15},
            width: { md: "30%" },
          }}
          size="small"
        />
      </AccordionForm>
      <AccordionForm title="Zona" sx={{justifyContent: "flex-start"}}>
        <TextField
          id="nombreZona"
          name="nombreZona"
          label="Nombre*"
          value={formik.values.nombreZona}
          onChange={formikChange}
          onBlur={formik.handleBlur}
          error={formik.touched.nombreZona && Boolean(formik.errors.nombreZona)}
          helperText={formik.touched.nombreZona && formik.errors.nombreZona}
          sx={{
            mt: { md: 15 },
            ml: { md: 21 },
            mb: {md: 15},
            width: { md: "30%" },
          }}
          size="small"
        />
         <TextField
         type="number"
          id="porcentajeAdicionalZona"
          name="porcentajeAdicionalZona"
          label="% adicional zona *"
          value={formik.values.porcentajeAdicionalZona}
          onChange={formikChange}
          onBlur={formik.handleBlur}
          error={formik.touched.porcentajeAdicionalZona && Boolean(formik.errors.porcentajeAdicionalZona)}
          helperText={formik.touched.porcentajeAdicionalZona && formik.errors.porcentajeAdicionalZona}
          sx={{
            mt: { md: 15 },
            ml: { md: 21 },
            width: { md: "30%" },
          }}
          size="small"
        />
      </AccordionForm>
      <AccordionForm title="Turno" sx={{justifyContent: "flex-start"}}>
        <TextField
          id="nombreTurno"
          name="nombreTurno"
          label="Nombre*"
          value={formik.values.nombreTurno}
          onChange={formikChange}
          onBlur={formik.handleBlur}
          error={formik.touched.nombreTurno && Boolean(formik.errors.nombreTurno)}
          helperText={formik.touched.nombreTurno && formik.errors.nombreTurno}
          sx={{
            mt: { md: 15 },
            ml: { md: 21 },
            mb: {md: 15},
            width: { md: "30%" },
          }}
          size="small"
        />
         <TextField
         type="number"
          id="porcentajeAdicionalTurno"
          name="porcentajeAdicionalTurno"
          label="% adicional turno *"
          value={formik.values.porcentajeAdicionalTurno}
          onChange={formikChange}
          onBlur={formik.handleBlur}
          error={formik.touched.porcentajeAdicionalTurno && Boolean(formik.errors.porcentajeAdicionalTurno)}
          helperText={formik.touched.porcentajeAdicionalTurno && formik.errors.porcentajeAdicionalTurno}
          sx={{
            mt: { md: 15 },
            ml: { md: 21 },
            width: { md: "30%" },
          }}
          size="small"
        />
      </AccordionForm>
    </>
  );
}

const dummy = () => {
  console.log("...");
};
export default dummy;
