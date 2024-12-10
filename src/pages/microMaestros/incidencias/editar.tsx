"use client";

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { fetchIncidenciaById, patchIncidencia } from "@/services/microMaestros/incidenciasService";
import InputCreateUpdate from "@/components/microMaestros/incidencias/formCreateUpdate/InputCreateUpdate";
import { IncidenciaDetalleResponse } from "@/types/microMaestros/incidenciasTypes";

const validationSchema = yup.object({
  nombre: yup
    .string()
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .required("Campo obligatorio"),
  tipo: yup.string().required("Campo obligatorio"),
});

export default function EditarIncidencia() {
  const router = useRouter();
  const { id } = router.query;
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const formik = useFormik({
    initialValues: { nombre: "", tipo: "Default" },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      patchIncidencia({ id: Number(id), ...values }) 
        .then(() => {
          setAlertMessage("Guardado con éxito");
          setAlertType(typeAlert.success);
          setTimeout(() => router.back(), 1000);
        })
        .catch((error) => {
          if(error.response.data.errors){
            setAlertMessage(error.response.data.errors[0].description);
          }
            else{
          setAlertMessage("Error al guardar la incidencia");
            }
          setAlertType(typeAlert.error);
        });
    },
  });

  useEffect(() => {
    if (id) {
      fetchIncidenciaById({ id: Number(id) })
      .then((data: IncidenciaDetalleResponse) => {
        formik.setValues({ nombre: data.nombre, tipo: data.tipoIncidencia });
      })
      .catch((error) => {
          setAlertMessage("Error al cargar la incidencia");
          setAlertType(typeAlert.error);
        });
    }
  }, [id]);

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", py: 20 }}>
      <SnackbarAlert message={alertMessage} type={alertType} setAlertMessage={setAlertMessage} setAlertType={setAlertType} />
      <Box display="flex" alignItems="center" sx={{ mb: 30 }}>
        <ArrowbackButton />
        <Typography variant="h1" sx={{ textAlign: "center", flexGrow: 1 }}>Editar Incidencia</Typography>
      </Box>
      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <InputCreateUpdate formik={formik} />
        <ButtonsCreateUpdate 
        disabled={!(formik.isValid && formik.dirty)} 
        isEdit={true}
        />
      </form>
    </Box>
  );
}
