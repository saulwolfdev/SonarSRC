"use Client";

import { Box, Card, TextField, Typography } from "@mui/material";
import AutocompleteUpdateCreate from "@/components/shared/AutocompleteCreateUpdate";
import RegistrosExistentes from "./RegistrosExistentes";
import { useEffect, useState } from "react";
import {
  CentroFisicoAPI,
  CentroFisicoDetalleResponce
} from "@/types/microMaestros/centrosFisicosTypes";
import {
  fetchCentrosFisicos,
  fetchClasificaciones,
  fetchProvinciasArgentinasHabilitadas,
} from "@/services/microMaestros/centroFisicoService";
import { IdOption } from "@/types/microMaestros/GenericTypes";

interface InputsCreateUpdateProps {
  formik: any;
  response?: CentroFisicoDetalleResponce | null;
}
export function InputsCreateUpdate({
  formik,
  response,
}: InputsCreateUpdateProps) {
  const [centrosExisting, setCentrosExisting] = useState<CentroFisicoAPI[]>([]);

  const [provinciaSeleccionada, setProvinciaSeleccionada] =
    useState<IdOption | null>(null);
  const [clasificacionSeleccionada, setClasificacionSeleccionada] =
    useState<IdOption | null>(null);

  useEffect(() => {
    if (response) {
      setProvinciaSeleccionada({
        id: response.provincia.id,
        label: response.provincia.isoName,
      });
      setClasificacionSeleccionada({
        id: response.clasificacion.id,
        label: response.clasificacion.nombre,
      });
    }
  }, [response]);

  const handleChangeNombre = (event: any) => {
    formik.handleChange(event);
    if (event.target.value.length > 2) {
      fetchCentrosFisicos({ nombre: event.target.value })
        .then((response) => {
          setCentrosExisting(response.data);
        })
        .catch((error) => {});
    } else {
      setCentrosExisting([]);
    }
  };

  const handleChangeClasificacion = (event: any, newValue: any) => {
    setClasificacionSeleccionada(newValue);
  };
  const handleChangeProvincia = (event: any, newValue: any) => {
    setProvinciaSeleccionada(newValue);
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
        <AutocompleteUpdateCreate
          idText="clasificacionId"
          name="clasificacionId"
          label="Clasificación"
          value={clasificacionSeleccionada}
          fetchOptions={fetchClasificaciones}
          onChange={handleChangeClasificacion}
          formikChange={formikChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.clasificacionId &&
            Boolean(formik.errors.clasificacionId)
          }
          helperText={
            formik.touched.clasificacionId && formik.errors.clasificacionId
          }
          sx={{
            mt: { md: 15 },

            width: { md: "30%" },
          }}
        />
        <AutocompleteUpdateCreate
          idText="provinciaId"
          name="provinciaId"
          label="Provincia"
          value={provinciaSeleccionada}
          fetchOptions={fetchProvinciasArgentinasHabilitadas}
          onChange={handleChangeProvincia}
          formikChange={formikChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.provinciaId && Boolean(formik.errors.provinciaId)
          }
          helperText={formik.touched.provinciaId && formik.errors.provinciaId}
          sx={{
            mt: { md: 15 },
            mr: { md: 21 },

            width: { md: "30%" },
          }}
        />
      </Box>
      <RegistrosExistentes centrosExisting={centrosExisting} />
    </Box>
  );
}
const dummy = () => {
  console.log('...')
}
export default dummy