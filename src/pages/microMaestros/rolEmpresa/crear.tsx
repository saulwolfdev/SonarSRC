"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import SnackbarAlert, { typeAlert } from "@/components/shared/SnackbarAlert";
import ButtonsCreateUpdate from "@/components/shared/ButtonsCreateUpdate";
import { InputsCreateUpdate } from "./components/formCreateUpdate/InputsCreateUpdate";
import ArrowbackButton from "@/components/shared/ArrowbackButton";
import { postRolEmpresa } from "@/services/microMaestros/RolEmpresaService";

const validationSchema = yup.object({
  nombre: yup
    .string()
    .min(3, "Debe tener entre 3 y 80 caracteres.")
    .max(80, "Debe tener entre 3 y 80 caracteres.")
    .matches(
      /^[a-zA-ZÑñ\s]+$/,
      "Solo se permiten letras incluida la Ñ, sin acentos"
    )
    .required("Campo obligatorio."),
  descripcion: yup
    .string()
    .max(250, "El campo debe tener máximo 250 caracteres")
    .matches(
      /^[a-zA-ZÑñ0-9\s]+$/,
      "Solo se permiten letras incluida la Ñ, sin acentos y números"
    )
    .notRequired(),
});

export default function CrearRolEmpresa() {
  const router = useRouter();

  // Respuesta
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertType, setAlertType] = useState<typeAlert | undefined>(undefined);

  const formik = useFormik({
    initialValues: {
      nombre: "",
      descripcion: "",
      estado: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      postRolEmpresa(values)
        .then((res) => {
          setAlertMessage("Se guardó con éxito");
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
        });
    },
  });

  return (
    <Box sx={{ width: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "flex-start", overflow: "hidden", paddingBottom:40 }}>
      <SnackbarAlert
        message={alertMessage}
        type={alertType}
        setAlertMessage={setAlertMessage}
        setAlertType={setAlertType}
      />
      <Box display="flex" alignItems="center">
        <ArrowbackButton />
        <Typography variant="h1" sx={{ textAlign: "center", flexGrow: 1 }}>
          Crear rol empresa
        </Typography>
      </Box>

      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <InputsCreateUpdate formik={formik} />
        <ButtonsCreateUpdate
          disabled={!formik.isValid || formik.isSubmitting}
          
        />
      </form>
    </Box>
  );
}
