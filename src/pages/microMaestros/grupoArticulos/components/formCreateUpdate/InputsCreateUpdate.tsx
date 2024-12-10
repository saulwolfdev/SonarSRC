"use Client";

import { Box, Card, TextField, Typography } from "@mui/material";
import AutocompleteUpdateCreate from "@/components/shared/AutocompleteCreateUpdate";
import { useEffect, useState } from "react";
import {
  GrupoArticulosAPI,
  GrupoArticulosDetalleResponce,
  GrupoArticulosUpdate,
} from "@/types/microMaestros/grupoArticulosTypes";

import {
  fetchIncidencia,
} from "@/services/microMaestros/grupoArticulosService";
import { FormikProps } from "formik";

import { IdOption } from "@/types/microMaestros/GenericTypes";

interface InputsCreateUpdateProps {
  formik: any //TODO FLOR   FormikProps<GrupoArticulosUpdate>;
  response?: GrupoArticulosDetalleResponce | null;
}
export function InputsCreateUpdate({
  formik,
  response,
}: InputsCreateUpdateProps) {

  const [incidencia, setIncidencia] =
    useState<IdOption | null>(null);

    useEffect(() => {
      if (response) {
        // Actualiza los valores de formik en función de los datos de response
        formik.setValues({
          ...formik.values,
          grupoArticulo: response.grupoArticulo || "",
          descripcion: response.descripcion || "",
          incidenciaId: response.incidenciaId | 0,
        });
  
        // Establece el valor de incidencia si está disponible en response
        setIncidencia({
          id: response.incidenciaId || 0,
          label: response.incidencia||   "",
        });
      }
    }, [response, formik]);


  const handleChangeIncidencias = (event: any, newValue: any) => {
    setIncidencia(newValue);
    formik.setFieldValue("incidenciaId", newValue ? newValue.id : "")
  };

  const formikChange = (event: any) => {
    formik.setFieldValue(event.target.name, event.target.value);
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
          id="grupoArticulo"
          name="grupoArticulo"
          label="Grupo de articulo"
          value={formik.values.grupoArticulo}
          disabled={true}  // Cambia a true para desactivar la edición
          error={formik.touched.grupoArticulo && Boolean(formik.errors.grupoArticulo)}
          helperText={formik.touched.grupoArticulo && formik.errors.grupoArticulo}
          sx={{
            mt: { md: 15 },
            ml: { md: 21 },
            width: { md: "30%" },
          }}
          size="small"
        />

        <TextField
          id="descripcion"
          name="descripcion"
          label="Descripcion"
          value={formik.values.descripcion}
          disabled={true}  // Cambia a true para desactivar la edición
          error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
          helperText={formik.touched.descripcion && formik.errors.descripcion}
          sx={{
            mt: { md: 15 },
            ml: { md: 21 },
            width: { md: "30%" },
          }}
          size="small"
        />

        <AutocompleteUpdateCreate
          idText="incidencia"
          name="incidenciaId"
          label="Incidencia"
          value={incidencia}
          fetchOptions={fetchIncidencia}
          onChange={handleChangeIncidencias}
          formikChange={formikChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.incidenciaId && Boolean(formik.errors.incidenciaId)
          }
          helperText={formik.touched.incidenciaId && formik.errors.incidenciaId}
          sx={{
            mt: { md: 15 },
            mr: { md: 21 },

            width: { md: "30%" },
          }}
        />
      </Box>
    </Box>
  );
}
const dummy = () => {
  console.log('...')
}
export default dummy