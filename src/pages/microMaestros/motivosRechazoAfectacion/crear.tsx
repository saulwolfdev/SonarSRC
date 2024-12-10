"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import { InputsCreateUpdate } from "@/components/microMaestros/motivosRechazoAfectacion/formCreateUpdate/InputsCreateUpdate";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { postMotivoRechazoObjecionAfectacion } from "@/services/microMaestros/motivosRechazoAfectacionService";

const validationSchema = yup.object().shape({
  nombre: yup.string()
    .matches(/^[a-zA-Z0-9Ññ\s]+$/, "Solo se permiten números y letras incluida la Ñ, sin acentos")
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .required("Campo obligatorio"),
  descripcion: yup.string()
    .matches(/^[a-zA-Z0-9Ññ\s]+$/, "Solo se permiten números y letras incluida la Ñ, sin acentos")
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .required("Campo obligatorio"),
  rechazo: yup.boolean()
    .oneOf([true, false], "Campo obligatorio")
    .default(true),
  objecion: yup.boolean()
    .oneOf([true, false], "Campo obligatorio")
    .default(false),
});

export default function CrearMotivoRechazoObjecionAfectacion() {
  const router = useRouter();

  // respuesta
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const formik = useFormik({
    initialValues: {
      nombre: "",
      descripcion: '',
      rechazo: true,
      objecion: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (!values.rechazo && !values.objecion) {
        setAlertMessage("En los campos Rechazo y Objeción no puede seleccionar la opción NO simultáneamente.");
        setAlertType(typeAlert.error);
      }
      else {
        postMotivoRechazoObjecionAfectacion(values)
          .then((res) => {
            setAlertMessage("Se guardo con éxito");
            setAlertType(typeAlert.success);
            setTimeout(() => {
              router.back();
            }, 1000);
          })
          .catch((error) => {
            if(error.response.data.errors){
              setAlertMessage(error.response.data.errors[0].description);
            }
              else{
              setAlertMessage(
                "No se pudo crear un nuevo dato, intente más tarde."
              );
            }
            setAlertType(typeAlert.error);
          })
          .finally();
      }
    },
  });

  return (
    <Box
      sx={{
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        overflow: "hidden",
        py: 20
      }}
    >
      <SnackbarAlert
        message={alertMessage}
        type={alertType}
        setAlertMessage={setAlertMessage}
        setAlertType={setAlertType}
      />
      <Box display="flex" alignItems="center" sx={{ mb: 30 }}>
        <ArrowbackButton />
        <Typography variant="h1" sx={{ textAlign: "center", flexGrow: 1 }}>
          Crear motivo de rechazo y/u objeción de afectación
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <InputsCreateUpdate formik={formik} />
        <ButtonsCreateUpdate
          disabled={!(formik.isValid && formik.dirty)}
        />
      </form>
    </Box>
  );
}

